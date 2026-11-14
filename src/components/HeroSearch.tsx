import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Breed, Category, Region } from '../types/marketplace';
import { SafeImage } from './SafeImage';

export interface QuickFilterValues {
  q: string;
  categoryId: string;
  breedId: string;
  regionId: string;
  maxPrice: string;
}

interface HeroSearchProps {
  categories: Category[];
  breeds: Breed[];
  regions: Region[];
  onSearch: (filters: QuickFilterValues) => void;
  onBrowseAll: () => void;
}

const HERO_MAX_PRICE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'بدون حد' },
  { value: '1500', label: 'حتى 1,500 ر.س' },
  { value: '3000', label: 'حتى 3,000 ر.س' },
  { value: '5000', label: 'حتى 5,000 ر.س' },
  { value: '10000', label: 'حتى 10,000 ر.س' },
  { value: '25000', label: 'حتى 25,000 ر.س' },
  { value: '50000', label: 'حتى 50,000 ر.س' },
  { value: '100000', label: 'حتى 100,000 ر.س' },
];

export function HeroSearch({
  categories,
  breeds,
  regions,
  onSearch,
  onBrowseAll,
}: HeroSearchProps) {
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [breedId, setBreedId] = useState('all');
  const [regionId, setRegionId] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');

  const mainCategories = useMemo(
    () => categories.filter((c) => c.parentId === null),
    [categories]
  );

  const availableBreeds = useMemo(() => {
    if (categoryId === 'all') return breeds;
    return breeds.filter((b) => b.categoryId === categoryId);
  }, [breeds, categoryId]);

  const handleCategoryChange = (nextCategoryId: string) => {
    setCategoryId(nextCategoryId);
    if (nextCategoryId !== 'all' && breedId !== 'all') {
      const stillMatches = breeds.some(
        (b) => b.id === breedId && b.categoryId === nextCategoryId
      );
      if (!stillMatches) {
        setBreedId('all');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ q: q.trim(), categoryId, breedId, regionId, maxPrice });
  };

  return (
    <section className="relative overflow-hidden bg-[#14261D]">
      {/* Background Pastoral Imagery with Measured Scrim */}
      <div className="absolute inset-0">
        <SafeImage
          src="/src/assets/images/hero_saudi_livestock_1794608168927.jpg"
          alt="قطيع من الأغنام النعيمية في مراعي المملكة العربية السعودية وقت الغروب"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-75"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0B3A29] via-[#0B3A29]/65 to-[#14261D]/55 dark:from-[#081711] dark:via-[#0B2319]/75 dark:to-[#0B1310]/70"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-[var(--color-gold)] mb-3 tracking-wide">
            سوق المواشي السعودي المتخصص · إعلانات موثوقة بالريال السعودي
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight text-balance">
            منصة المربين والمشترين الأولى للأنعام والسلالات الأصيلة
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#FAF6EC]/90 leading-relaxed max-w-2xl">
            تصفّح إعلانات النعيمي والنجدي والحري والماعز العارضي بمواصفات دقيقة للعمر والوزن، وتواصل مباشرة مع المربين الموثقين في جميع مناطق المملكة.
          </p>
        </div>

        {/* Quick Search & Filter Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-[var(--color-surface)] rounded-xl p-3 sm:p-4 shadow-lg border border-[var(--color-border)] transition-colors"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-2 lg:col-span-3">
              <label
                htmlFor="hero-search-q"
                className="block text-xs font-medium text-[var(--color-muted)] mb-1.5"
              >
                ابحث عن سلالة أو مدينة أو مواصفات
              </label>
              <div className="relative">
                <Search
                  size={17}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                  aria-hidden="true"
                />
                <input
                  id="hero-search-q"
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  maxLength={120}
                  placeholder="مثال: جذعان نعيمي، فحل، حفر الباطن..."
                  className="w-full h-11 pr-10 pl-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)]/60 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/75 focus:outline-none focus:border-[var(--color-green-ink)]"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="hero-cat"
                className="block text-xs font-medium text-[var(--color-muted)] mb-1.5"
              >
                التصنيف
              </label>
              <select
                id="hero-cat"
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-green-ink)]"
              >
                <option value="all">جميع التصنيفات</option>
                {mainCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="hero-breed"
                className="block text-xs font-medium text-[var(--color-muted)] mb-1.5"
              >
                السلالة
              </label>
              <select
                id="hero-breed"
                value={breedId}
                onChange={(e) => setBreedId(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-green-ink)]"
              >
                <option value="all">جميع السلالات</option>
                {availableBreeds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="hero-reg"
                className="block text-xs font-medium text-[var(--color-muted)] mb-1.5"
              >
                المنطقة
              </label>
              <select
                id="hero-reg"
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-green-ink)]"
              >
                <option value="all">كل المناطق</option>
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="hero-price"
                className="block text-xs font-medium text-[var(--color-muted)] mb-1.5"
              >
                السعر الأقصى (ر.س)
              </label>
              <select
                id="hero-price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] tabular-nums focus:outline-none focus:border-[var(--color-green-ink)]"
              >
                {HERO_MAX_PRICE_OPTIONS.map((opt) => (
                  <option key={opt.value || 'all'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1 flex gap-2">
              <button
                type="submit"
                className="w-full h-11 px-4 rounded-lg bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                ابحث الآن
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#FAF6EC]/85">
          <span>فحص مواصفات العمر والوزن قبل الشراء</span>
          <span aria-hidden="true">·</span>
          <span>أسعار استرشادية محدثة للسوق السعودي</span>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={onBrowseAll}
            className="text-[var(--color-gold)] hover:underline font-medium cursor-pointer"
          >
            استعراض جميع الإعلانات المتاحة
          </button>
        </div>
      </div>
    </section>
  );
}
