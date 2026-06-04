package automation.pages;

import automation.enums.CatalogColorOptionEnum;
import automation.enums.CatalogStorageOptionEnum;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class CatalogDetailPage {

	private final WebDriver driver;

	@FindBy(id = "detail-title")
	private WebElement detailTitle;

	@FindBy(xpath = "//button[normalize-space()='Back to catalog results']")
	private WebElement backToCatalogResultsButton;

	@FindBy(id = "detail-colors-title")
	private WebElement selectColorHeading;

	@FindBy(id = "detail-storage-title")
	private WebElement selectStorageHeading;

	@FindBy(xpath = "//button[normalize-space()='Buy now']")
	private WebElement buyNowButton;

	public CatalogDetailPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void waitForPageReady() {
		WaitUtil.waitForVisibility(driver, detailTitle);
		WaitUtil.waitForVisibility(driver, selectColorHeading);
		WaitUtil.waitForVisibility(driver, selectStorageHeading);
	}

	public void clickBackToCatalogResults() {
		WaitUtil.waitForClickable(driver, backToCatalogResultsButton);
		backToCatalogResultsButton.click();
	}

	public void selectColor(CatalogColorOptionEnum colorOption) {
		WebElement colorButton = driver.findElement(By.xpath("//section[@aria-labelledby='detail-colors-title']//button[.//span[normalize-space()='" + colorOption.getDisplayValue() + "']]"));
		WaitUtil.waitForClickable(driver, colorButton);
		colorButton.click();
	}

	public void selectStorage(CatalogStorageOptionEnum storageOption) {
		WebElement storageButton = driver.findElement(By.xpath("//section[@aria-labelledby='detail-storage-title']//button[normalize-space()='" + storageOption.getDisplayValue() + "']"));
		WaitUtil.waitForClickable(driver, storageButton);
		storageButton.click();
	}

	public void clickBuyNow() {
		WaitUtil.waitForClickable(driver, buyNowButton);
		buyNowButton.click();
	}

	public void clickPrimaryPurchaseAction() {
		WebElement primaryAction = driver.findElement(By.xpath("//div[contains(@class,'purchase-card')]//button[normalize-space()='Add to cart' or normalize-space()='Unavailable']"));
		WaitUtil.waitForClickable(driver, primaryAction);
		primaryAction.click();
	}

	public boolean isPrimaryPurchaseActionDisabled() {
		WebElement primaryAction = driver.findElement(By.xpath("//div[contains(@class,'purchase-card')]//button[normalize-space()='Add to cart' or normalize-space()='Unavailable']"));
		return !primaryAction.isEnabled();
	}
}
