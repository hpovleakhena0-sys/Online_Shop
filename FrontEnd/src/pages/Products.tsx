import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid3X3, LayoutGrid, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { products, categories } from '@/data/products';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const priceRanges = [
  { id: 'under-100', label: 'Under $100', min: 0, max: 100 },
  { id: '100-300', label: '$100 - $300', min: 100, max: 300 },
  { id: '300-500', label: '$300 - $500', min: 300, max: 500 },
  { id: 'over-500', label: 'Over $500', min: 500, max: Infinity },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(
    searchParams.get('filter') === 'new'
  );

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category.slug)
      );
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((p) => {
        return selectedPriceRanges.some((rangeId) => {
          const range = priceRanges.find((r) => r.id === rangeId);
          if (!range) return false;
          return p.price >= range.min && p.price < range.max;
        });
      });
    }

    // On sale filter
    if (showOnSale) {
      filtered = filtered.filter((p) => p.originalPrice);
    }

    // New only filter
    if (showNewOnly) {
      filtered = filtered.filter((p) => p.isNew);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [selectedCategories, selectedPriceRanges, showOnSale, showNewOnly, sortBy]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    );
  };

  const togglePriceRange = (id: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setShowOnSale(false);
    setShowNewOnly(false);
    setSearchParams({});
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedPriceRanges.length +
    (showOnSale ? 1 : 0) +
    (showNewOnly ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h4 className="font-medium mb-4">Categories</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {category.name}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                ({category.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-4">Price Range</h4>
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <label
              key={range.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedPriceRanges.includes(range.id)}
                onCheckedChange={() => togglePriceRange(range.id)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Special Filters */}
      <div>
        <h4 className="font-medium mb-4">Special</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={showOnSale}
              onCheckedChange={(checked) => setShowOnSale(checked as boolean)}
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              On Sale
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={showNewOnly}
              onCheckedChange={(checked) => setShowNewOnly(checked as boolean)}
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              New Arrivals
            </span>
          </label>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">
              {showNewOnly
                ? 'New Arrivals'
                : selectedCategories.length === 1
                ? categories.find((c) => c.slug === selectedCategories[0])?.name || 'Shop'
                : 'All Products'}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} products
            </p>
          </motion.div>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg font-medium flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                  </h3>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary">{activeFiltersCount}</Badge>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5" />
                        Filters
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="hidden md:flex items-center gap-2 flex-1">
                    {selectedCategories.map((slug) => {
                      const category = categories.find((c) => c.slug === slug);
                      return (
                        <Badge
                          key={slug}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => toggleCategory(slug)}
                        >
                          {category?.name}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      );
                    })}
                    {showOnSale && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => setShowOnSale(false)}
                      >
                        On Sale
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                    {showNewOnly && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => setShowNewOnly(false)}
                      >
                        New Arrivals
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                  </div>
                )}

                {/* Sort & View Options */}
                <div className="flex items-center gap-3 ml-auto">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="hidden md:flex items-center gap-1 border border-border rounded-md p-1">
                    <Button
                      variant={gridColumns === 3 ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setGridColumns(3)}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={gridColumns === 4 ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setGridColumns(4)}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} columns={gridColumns} />
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground mb-4">
                    No products found matching your criteria.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
