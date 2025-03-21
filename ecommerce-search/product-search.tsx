"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

// Product type definition
type Product = {
  id: number
  name: string
  description: string
  price: number
  category: string
  rating: number
  image: string
  tags: string[]
}

// Sample product data
const products: Product[] = [
  {
    id: 1,
    name: "Minimalist Desk Lamp",
    description: "Modern LED desk lamp with adjustable brightness",
    price: 49.99,
    category: "Home Decor",
    rating: 4.5,
    image: "/placeholder.svg?height=300&width=300",
    tags: ["lighting", "desk", "modern"],
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    description: "Comfortable chair with lumbar support",
    price: 199.99,
    category: "Furniture",
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=300",
    tags: ["chair", "office", "ergonomic"],
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    description: "Noise-cancelling earbuds with long battery life",
    price: 129.99,
    category: "Electronics",
    rating: 4.3,
    image: "/placeholder.svg?height=300&width=300",
    tags: ["audio", "wireless", "earbuds"],
  },
  {
    id: 4,
    name: "Ceramic Coffee Mug",
    description: "Handcrafted ceramic mug for hot beverages",
    price: 19.99,
    category: "Kitchen",
    rating: 4.2,
    image: "/placeholder.svg?height=300&width=300",
    tags: ["mug", "ceramic", "coffee"],
  },
  {
    id: 5,
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitoring",
    price: 249.99,
    category: "Electronics",
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=300",
    tags: ["watch", "smart", "fitness"],
  },
  {
    id: 6,
    name: "Leather Wallet",
    description: "Genuine leather wallet with RFID protection",
    price: 39.99,
    category: "Accessories",
    rating: 4.4,
    image: "/placeholder.svg?height=300&width=300",
    tags: ["wallet", "leather", "accessories"],
  },
  {
    id: 7,
    name: "Portable Bluetooth Speaker",
    description: "Waterproof speaker with 360° sound",
    price: 79.99,
    category: "Electronics",
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=300",
    tags: ["speaker", "bluetooth", "portable"],
  },
  {
    id: 8,
    name: "Cotton Throw Blanket",
    description: "Soft and cozy blanket for your living room",
    price: 34.99,
    category: "Home Decor",
    rating: 4.1,
    image: "/placeholder.svg?height=300&width=300",
    tags: ["blanket", "cotton", "home"],
  },
]

// Get unique categories from products
const categories = Array.from(new Set(products.map((product) => product.category)))

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300])
  const [minRating, setMinRating] = useState(0)
  const [sortOption, setSortOption] = useState("featured")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category))
    }

    // Apply price range filter
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Apply rating filter
    if (minRating > 0) {
      result = result.filter((product) => product.rating >= minRating)
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      // Default is "featured", no sorting needed
    }

    setFilteredProducts(result)

    // Count active filters
    let count = 0
    if (searchQuery) count++
    if (selectedCategories.length > 0) count++
    if (priceRange[0] > 0 || priceRange[1] < 300) count++
    if (minRating > 0) count++
    setActiveFilters(count)
  }, [searchQuery, selectedCategories, priceRange, minRating, sortOption])

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setPriceRange([0, 300])
    setMinRating(0)
    setSortOption("featured")
  }

  // Remove a specific filter
  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case "search":
        setSearchQuery("")
        break
      case "category":
        if (value) {
          setSelectedCategories((prev) => prev.filter((c) => c !== value))
        }
        break
      case "price":
        setPriceRange([0, 300])
        break
      case "rating":
        setMinRating(0)
        break
    }
  }

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Filters</h3>
        <Button variant="ghost" className="h-8 px-2 text-xs" onClick={resetFilters}>
          Reset all
        </Button>
      </div>

      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={["categories", "price", "rating"]}>
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={[0, 300]}
                  max={300}
                  step={1}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="py-4"
                />
                <div className="flex items-center justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rating">
            <AccordionTrigger>Rating</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={minRating === rating}
                      onCheckedChange={(checked) => {
                        if (checked) setMinRating(rating)
                        else if (minRating === rating) setMinRating(0)
                      }}
                    />
                    <Label htmlFor={`rating-${rating}`} className="flex">
                      {Array(rating)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i} className="text-yellow-400">
                            ★
                          </span>
                        ))}
                      {Array(5 - rating)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i} className="text-gray-300">
                            ★
                          </span>
                        ))}
                      <span className="ml-1">& Up</span>
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with search and sort */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Shop Products</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden flex gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilters > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {activeFilters}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow down your product search</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active filters */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter("search")}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove search filter</span>
                </Button>
              </Badge>
            )}

            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeFilter("category", category)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove category filter</span>
                </Button>
              </Badge>
            ))}

            {(priceRange[0] > 0 || priceRange[1] < 300) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: ${priceRange[0]} - ${priceRange[1]}
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter("price")}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove price filter</span>
                </Button>
              </Badge>
            )}

            {minRating > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {minRating}+ Stars
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter("rating")}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove rating filter</span>
                </Button>
              </Badge>
            )}

            {activeFilters > 1 && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={resetFilters}>
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main content with sidebar and products */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar filters - desktop only */}
        <aside className="hidden lg:block">
          <FilterContent />
        </aside>

        {/* Product grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              <Button onClick={resetFilters} className="mt-4">
                Reset all filters
              </Button>
            </div>
          ) : (
            <>
              <p className="mb-4 text-muted-foreground">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
                      <span className="sr-only">View {product.name}</span>
                    </Link>
                    <div className="aspect-square overflow-hidden bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg truncate">{product.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <span
                                key={i}
                                className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                              >
                                ★
                              </span>
                            ))}
                        </div>
                        <span className="ml-1 text-sm text-muted-foreground">({product.rating.toFixed(1)})</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-medium">${product.price.toFixed(2)}</span>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

