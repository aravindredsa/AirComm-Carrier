package automation.enums;

public enum CatalogSortOptionEnum {
	BEST_MATCH("Best match"),
	PRICE_LOW_TO_HIGH("Price: Low to High"),
	PRICE_HIGH_TO_LOW("Price: High to Low"),
	TOP_RATED("Top rated");

	private final String displayValue;

	CatalogSortOptionEnum(String displayValue) {
		this.displayValue = displayValue;
	}

	public String getDisplayValue() {
		return displayValue;
	}
}
