package automation.enums;

public enum CatalogRoleEnum {
	CUSTOMER("Customer"),
	SALES_AGENT("Sales Agent");

	private final String displayValue;

	CatalogRoleEnum(String displayValue) {
		this.displayValue = displayValue;
	}

	public String getDisplayValue() {
		return displayValue;
	}
}
