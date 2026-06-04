
# Unit Test Case Templates

## Template 1 — Service / Handler (Moq + xUnit)

```csharp
using FluentAssertions;
using Moq;
using Xunit;
using MyApp.Application.Services;
using MyApp.Domain.Interfaces;
using MyApp.Domain.Entities;

namespace MyApp.UnitTests.Services;

public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _orderRepositoryMock;
    private readonly Mock<IStockService> _stockServiceMock;
    private readonly OrderService _sut;

    public OrderServiceTests()
    {
        _orderRepositoryMock = new Mock<IOrderRepository>();
        _stockServiceMock = new Mock<IStockService>();
        _sut = new OrderService(
            _orderRepositoryMock.Object,
            _stockServiceMock.Object
        );
    }

    [Fact]
    public async Task PlaceOrder_WithValidCart_ShouldCreateOrderSuccessfully()
    {
        // Arrange
        var cart = new Cart { Items = new List<CartItem> { new() { ProductId = 1, Quantity = 2 } } };
        _stockServiceMock.Setup(x => x.IsInStockAsync(1, 2)).ReturnsAsync(true);
        _orderRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Order>())).ReturnsAsync(new Order { Id = 1 });

        // Act
        var result = await _sut.PlaceOrderAsync(cart);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        _orderRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Order>()), Times.Once);
    }
}
```

---

## Template 2 — Controller (WebApplicationFactory or Mocked Mediator)

```csharp
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using MyApp.API.Controllers;
using MyApp.Application.Commands;
using MyApp.Application.Queries;

namespace MyApp.UnitTests.Controllers;

public class UserControllerTests
{
    private readonly Mock<IMediator> _mediatorMock;
    private readonly UserController _sut;

    public UserControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _sut = new UserController(_mediatorMock.Object);
    }

    [Fact]
    public async Task GetById_WhenUserExists_ShouldReturn200WithUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var expectedUser = new UserDto { Id = userId, Name = "Alice" };
        _mediatorMock.Setup(x => x.Send(It.IsAny<GetUserByIdQuery>(), default))
                     .ReturnsAsync(expectedUser);

        // Act
        var result = await _sut.GetById(userId);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeEquivalentTo(expectedUser);
    }
}
```

---

## Template 3 — Domain Entity (Pure Unit Test, No Mocks)

```csharp
using FluentAssertions;
using Xunit;
using MyApp.Domain.Entities;
using MyApp.Domain.Exceptions;

namespace MyApp.UnitTests.Domain;

public class OrderTests
{
    [Fact]
    public void AddItem_WithValidItem_ShouldIncreaseItemCount()
    {
        // Arrange
        var order = Order.Create(customerId: Guid.NewGuid());
        var item = new OrderItem(productId: 1, quantity: 2, unitPrice: 9.99m);

        // Act
        order.AddItem(item);

        // Assert
        order.Items.Should().HaveCount(1);
        order.TotalAmount.Should().Be(19.98m);
    }
}
```

---

## Template 4 — Repository (EF Core InMemory)

```csharp
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;
using MyApp.Infrastructure.Data;
using MyApp.Infrastructure.Repositories;
using MyApp.Domain.Entities;

namespace MyApp.UnitTests.Repositories;

public class ProductRepositoryTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly ProductRepository _sut;

    public ProductRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _sut = new ProductRepository(_context);
    }

    [Fact]
    public async Task GetByIdAsync_WhenProductExists_ShouldReturnProduct()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "Widget", Price = 9.99m };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Widget");
    }

    public void Dispose() => _context.Dispose();
}
```

---

## Template 5 — Middleware

```csharp
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using MyApp.API.Middleware;
using MyApp.Domain.Exceptions;

namespace MyApp.UnitTests.Middleware;

public class ExceptionMiddlewareTests
{
    private readonly Mock<ILogger<ExceptionMiddleware>> _loggerMock;
    private readonly ExceptionMiddleware _sut;

    public ExceptionMiddlewareTests()
    {
        _loggerMock = new Mock<ILogger<ExceptionMiddleware>>();
    }

    [Fact]
    public async Task InvokeAsync_WhenUnhandledException_ShouldReturn500AndLog()
    {
        // Arrange
        RequestDelegate next = _ => throw new Exception("Unexpected error");
        var middleware = new ExceptionMiddleware(next, _loggerMock.Object);
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be(500);
        _loggerMock.Verify(
            x => x.Log(LogLevel.Error, It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(), It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}
```
