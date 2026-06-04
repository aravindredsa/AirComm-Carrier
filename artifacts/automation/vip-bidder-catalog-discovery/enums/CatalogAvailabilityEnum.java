package automation.enums;

public enum CatalogAvailabilityEnum {
	IN_STOCK("In stock"),
	LOW_STOCK("Low stock"),
	PRE_ORDER("Pre-order"),
	OUT_OF_STOCK("Out of stock");

	private final String displayValue;

	CatalogAvailabilityEnum(String displayValue) {
		this.displayValue = displayValue;
	}

	public String getDisplayValue() {
		return displayValue;
	}
}
