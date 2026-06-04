package automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class CatalogPermissionPage {

	private final WebDriver driver;

	@FindBy(id = "permission-title")
	private WebElement permissionTitle;

	@FindBy(xpath = "//strong[normalize-space()='Permission denied']")
	private WebElement permissionDeniedBanner;

	@FindBy(xpath = "//span[contains(normalize-space(),'Allowed navigation: customer storefront or agent sales portal.')]")
	private WebElement allowedNavigationMessage;

	public CatalogPermissionPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void waitForPageReady() {
		WaitUtil.waitForVisibility(driver, permissionTitle);
		WaitUtil.waitForVisibility(driver, permissionDeniedBanner);
		WaitUtil.waitForVisibility(driver, allowedNavigationMessage);
	}

	public String getPermissionTitleText() {
		return permissionTitle.getText();
	}

	public String getAllowedNavigationMessageText() {
		return allowedNavigationMessage.getText();
	}
}
