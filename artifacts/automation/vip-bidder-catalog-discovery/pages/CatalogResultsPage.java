package automation.pages;

import automation.enums.CatalogAvailabilityEnum;
import automation.enums.CatalogBrandEnum;
import automation.enums.CatalogColorOptionEnum;
import automation.enums.CatalogSortOptionEnum;
import automation.enums.CatalogStorageOptionEnum;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class CatalogResultsPage {

	private final WebDriver driver;

	@FindBy(id = "catalog-title")
	private WebElement catalogTitle;

	@FindBy(id = "search-products")
	private WebElement searchProductsInput;

	@FindBy(id = "sort-products")
	private WebElement sortSelect;

	@FindBy(id = "filters-title")
	private WebElement filtersTitle;

	@FindBy(css = ".product-card")
	private List<WebElement> productCards;

	@FindBy(xpath = "//button[normalize-space()='Clear all']")
	private WebElement clearAllButton;

	@FindBy(xpath = "//button[normalize-space()='Apply filters']")
	private WebElement applyFiltersButton;

	@FindBy(xpath = "//button[normalize-space()='Reset filters']")
	private List<WebElement> resetFiltersButtons;

	@FindBy(xpath = "//strong[normalize-space()='Loading eligible products']")
	private List<WebElement> loadingPanel;

	@FindBy(xpath = "//strong[normalize-space()='Catalog API is unavailable']")
	private List<WebElement> errorPanel;

	@FindBy(xpath = "//button[normalize-space()='Retry catalog load']")
	private List<WebElement> retryCatalogLoadButtons;

	@FindBy(xpath = "//strong[normalize-space()='No products matched the current criteria']")
	private List<WebElement> emptyPanel;

	@FindBy(css = ".inline-feedback.inline-feedback--danger")
	private List<WebElement> validationAlerts;

	public CatalogResultsPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void waitForPageReady() {
		WaitUtil.waitForVisibility(driver, catalogTitle);
		WaitUtil.waitForVisibility(driver, filtersTitle);
	}

	public void setSearchProducts(String searchTerm) {
		WaitUtil.waitForVisibility(driver, searchProductsInput);
		searchProductsInput.clear();
		searchProductsInput.sendKeys(searchTerm);
	}

	public void clickApplyFilters() {
		WaitUtil.waitForClickable(driver, applyFiltersButton);
		applyFiltersButton.click();
	}

	public void clickClearAll() {
		WaitUtil.waitForClickable(driver, clearAllButton);
		clearAllButton.click();
	}

	public void clickResetFilters() {
		WebElement resetButton = resetFiltersButtons.get(0);
		WaitUtil.waitForClickable(driver, resetButton);
		resetButton.click();
	}

	public void selectSortOption(CatalogSortOptionEnum sortOption) {
		WaitUtil.waitForVisibility(driver, sortSelect);
		sortSelect.click();
		driver.findElement(By.xpath("//select[@id='sort-products']/option[normalize-space()='" + sortOption.getDisplayValue() + "']")).click();
	}

	public void toggleBrand(CatalogBrandEnum brand) {
		WebElement checkbox = driver.findElement(By.xpath("//label[.//span[normalize-space()='" + brand.getDisplayValue() + "']]//input[@type='checkbox']"));
		WaitUtil.waitForClickable(driver, checkbox);
		checkbox.click();
	}

	public void toggleAvailability(CatalogAvailabilityEnum availability) {
		WebElement checkbox = driver.findElement(By.xpath("//label[.//span[normalize-space()='" + availability.getDisplayValue() + "']]//input[@type='checkbox']"));
		WaitUtil.waitForClickable(driver, checkbox);
		checkbox.click();
	}

	public void toggleStorage(CatalogStorageOptionEnum storageOption) {
		WebElement chip = driver.findElement(By.xpath("//section[@aria-labelledby='storage-filter-title']//button[normalize-space()='" + storageOption.getDisplayValue() + "']"));
		WaitUtil.waitForClickable(driver, chip);
		chip.click();
	}

	public void toggleColor(CatalogColorOptionEnum colorOption) {
		WebElement colorButton = driver.findElement(By.cssSelector("button[aria-label='Toggle " + colorOption.getDisplayValue() + " color filter']"));
		WaitUtil.waitForClickable(driver, colorButton);
		colorButton.click();
	}

	public void clickRetryCatalogLoad() {
		WebElement retryButton = retryCatalogLoadButtons.get(0);
		WaitUtil.waitForClickable(driver, retryButton);
		retryButton.click();
	}

	public void clickViewDetailsByProductName(String productName) {
		WebElement viewDetailsButton = driver.findElement(By.cssSelector("button[aria-label='View " + productName + "']"));
		WaitUtil.waitForClickable(driver, viewDetailsButton);
		viewDetailsButton.click();
	}

	public void clickAddToCartByProductName(String productName) {
		WebElement addToCartButton = driver.findElement(By.cssSelector("button[aria-label='Add " + productName + " to cart']"));
		WaitUtil.waitForClickable(driver, addToCartButton);
		addToCartButton.click();
	}

	public int getVisibleProductCardCount() {
		WaitUtil.waitForVisibility(driver, catalogTitle);
		return productCards.size();
	}

	public boolean isErrorPanelVisible() {
		return !errorPanel.isEmpty();
	}

	public boolean isLoadingPanelVisible() {
		return !loadingPanel.isEmpty();
	}

	public boolean isEmptyPanelVisible() {
		return !emptyPanel.isEmpty();
	}

	public boolean hasValidationAlertWithText(String text) {
		return validationAlerts.stream().anyMatch(alert -> alert.getText().contains(text));
	}

	public boolean isCorrelationIdVisible() {
		By correlationIdPlaceholder = By.cssSelector("PLACEHOLDER_CORRELATION_ID_LOCATOR");
		return !driver.findElements(correlationIdPlaceholder).isEmpty();
	}

	public void setPriceRangeToMaximum() {
		By priceRangePlaceholder = By.cssSelector("PLACEHOLDER_PRICE_RANGE_LOCATOR");
		WebElement range = driver.findElement(priceRangePlaceholder);
		WaitUtil.waitForClickable(driver, range);
		range.sendKeys("1800");
	}

	public void waitForResultsRowVisibility() {
		By resultsRowPlaceholder = By.cssSelector("PLACEHOLDER_RESULTS_ROW_LOCATOR");
		WaitUtil.waitForVisibility(driver, driver.findElement(resultsRowPlaceholder));
	}
}
