import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CatalogExperience } from './CatalogExperience'
import { createCatalogService } from './catalog.service'
import type { CatalogService } from './catalog.types'

describe('CatalogExperience', () => {
  it('renders the catalog results after loading', async () => {
    render(<CatalogExperience service={createCatalogService(0)} />)

    expect(screen.getByText('Loading eligible products')).toBeInTheDocument()

    await expect(
      screen.findByRole('button', { name: 'View iPhone 15 Pro' }),
    ).resolves.toBeInTheDocument()
  })

  it('applies search filters and preserves navigation back from detail', async () => {
    const user = userEvent.setup()
    render(<CatalogExperience service={createCatalogService(0)} />)

    await screen.findByRole('button', { name: 'View iPhone 15 Pro' })

    await user.type(screen.getByLabelText('Search products'), 'pixel')
    await user.click(screen.getByRole('button', { name: 'Apply filters' }))

    await expect(
      screen.findByRole('button', { name: 'View Google Pixel 8' }),
    ).resolves.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'View iPhone 15 Pro' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'View Google Pixel 8' }))
    expect(
      await screen.findByRole('heading', { name: 'Google Pixel 8' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back to catalog results' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'View Google Pixel 8' })).toBeInTheDocument()
    })
  })

  it('shows validation feedback for short search input', async () => {
    const user = userEvent.setup()
    render(<CatalogExperience service={createCatalogService(0)} />)

    await screen.findByRole('button', { name: 'View iPhone 15 Pro' })
    await user.type(screen.getByLabelText('Search products'), 'a')
    await user.click(screen.getByRole('button', { name: 'Apply filters' }))

    expect(
      screen.getByText('Search term is outside allowed length range (2-40 characters).'),
    ).toBeInTheDocument()
  })

  it('shows an error state when the catalog service fails', async () => {
    const failingService: CatalogService = {
      searchProducts: vi.fn().mockRejectedValue(new Error('Catalog API is unavailable. Please retry to continue.')),
    }

    render(<CatalogExperience service={failingService} />)

    expect(
      await screen.findByText('Catalog API is unavailable'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry catalog load' })).toBeInTheDocument()
  })

  it('shows permission denied for unsupported roles', () => {
    render(<CatalogExperience role="manager" service={createCatalogService(0)} />)

    expect(screen.getByText('Permission denied')).toBeInTheDocument()
    expect(
      screen.getByText('This experience is only available to customers and sales agents.'),
    ).toBeInTheDocument()
  })
})