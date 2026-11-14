import { Heart, Play, ShieldCheck, ThumbsUp, User as UserIcon } from 'lucide-react';
import type { Breed, Category, Listing, Region, SellerProfile } from '../types/marketplace';
import { formatPriceSar, formatRelativeArabicTime } from '../lib/format';
import { SafeImage } from './SafeImage';
import { isSellerVerified, VerifiedSellerBadge } from './VerifiedSellerBadge';

interface ListingCardProps {
  listing: Listing;
  breed?: Breed;
  subCategory?: Category;
  region?: Region;
  seller?: SellerProfile;
  isFavorite: boolean;
  isLiked?: boolean;
  onSelect: (listing: Listing) => void;
  onSelectSeller?: (sellerId: string) => void;
  onToggleFavorite: (listingId: string) => void;
  onToggleLike?: (listingId: string) => void;
}

export function ListingCard({
  listing,
  breed,
  subCategory,
  region,
  seller,
  isFavorite,
  isLiked = false,
  onSelect,
  onSelectSeller,
  onToggleFavorite,
  onToggleLike,
}: ListingCardProps) {
  const coverImage = listing.images[0]?.url || breed?.imageUrl;
  const likesCount = listing.likesCount ?? 0;
  const canLike = listing.status === 'Published' && Boolean(onToggleLike);
  const totalHerdValue =
    listing.quantity > 1 ? listing.priceAmount * listing.quantity : null;

  return (
    <article className="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col min-w-0">
      {/* Uniform 4:3 Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-cream)]">
        <button
          type="button"
          onClick={() => onSelect(listing)}
          className="w-full h-full block text-right cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
          aria-label={`عرض تفاصيل ${listing.title}`}
        >
          <SafeImage
            src={coverImage}
            alt={listing.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </button>

        {listing.video?.url && (
          <span className="pointer-events-none absolute top-3 right-3 px-2 py-1 rounded-md bg-[var(--color-green)]/90 text-white text-[11px] font-semibold inline-flex items-center gap-1 shadow-sm">
            <Play size={11} className="fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" />
            <span>فيديو</span>
          </span>
        )}

        {/* Private Favorite Toggle (44x44 touch target) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(listing.id);
          }}
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          title={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
          aria-pressed={isFavorite}
          className={`absolute top-2.5 left-2.5 w-11 h-11 rounded-lg flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] ${
            isFavorite
              ? 'bg-[var(--color-green)] text-[var(--color-gold)]'
              : 'bg-[var(--color-surface)]/90 text-[var(--color-ink)] hover:bg-[var(--color-surface)]'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card Body: Clean Unboxed Metadata, Title, Prominent Green Price */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 min-w-0">
        <div className="min-w-0">
          {/* Unboxed Metadata Line (Zero-Pill Rule) */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-[var(--color-muted)] mb-1.5">
            <span className="font-semibold text-[var(--color-green-ink)]">
              {breed?.name || 'أغنام'}
            </span>
            {subCategory && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[var(--color-ink)] font-medium">{subCategory.name}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{listing.ageMonths} أشهر</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{listing.weightKg} كجم</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-semibold text-[var(--color-ink)]">
              {listing.quantity} رأس
            </span>
            {listing.vaccinated && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-0.5 text-[var(--color-green-ink)] font-medium">
                  <ShieldCheck size={12} aria-hidden="true" />
                  <span>محصّن</span>
                </span>
              </>
            )}
          </div>

          <h3 className="font-display text-base font-bold text-[var(--color-ink)] leading-snug line-clamp-2">
            <button
              type="button"
              onClick={() => onSelect(listing)}
              className="text-right hover:text-[var(--color-green-ink)] transition-colors cursor-pointer"
            >
              {listing.title}
            </button>
          </h3>

          {seller && (
            <div className="mt-2 flex items-center flex-wrap gap-1.5 text-xs min-w-0">
              <UserIcon
                size={13}
                className="text-[var(--color-muted)] shrink-0"
                aria-hidden="true"
              />
              {onSelectSeller ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSeller(seller.userId);
                  }}
                  className="font-semibold text-[var(--color-ink)] hover:text-[var(--color-green-ink)] hover:underline transition-colors cursor-pointer truncate max-w-[180px]"
                >
                  {seller.displayName}
                </button>
              ) : (
                <span className="font-semibold text-[var(--color-ink)] truncate max-w-[180px]">
                  {seller.displayName}
                </span>
              )}
              {isSellerVerified(seller) && <VerifiedSellerBadge variant="inline" />}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[var(--color-border)]/80 space-y-2.5 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="min-w-0">
              <p className="font-display text-lg font-extrabold text-[var(--color-green-ink)] tabular-nums">
                {formatPriceSar(listing.priceAmount)}
                <span className="text-[11px] font-semibold text-[var(--color-muted)] mr-1">
                  / للرأس
                </span>
              </p>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5 tabular-nums">
                {listing.allowPriceOffers
                  ? 'يقبل عروض السعر'
                  : listing.isNegotiable
                  ? 'قابل للتفاوض'
                  : 'سعر ثابت'}
                {totalHerdValue !== null &&
                  ` · ${listing.quantity} رأس (${formatPriceSar(totalHerdValue)} إجمالي)`}
              </p>
            </div>

            <div className="text-left text-xs text-[var(--color-muted)] shrink-0">
              <p className="font-medium text-[var(--color-ink)]">
                {region?.name || ''} — {listing.city}
              </p>
              <p className="text-[11px] mt-0.5">{formatRelativeArabicTime(listing.publishedAt)}</p>
            </div>
          </div>

          {/* Public Likes Engagement Bar (Separate from Favorites) */}
          <div className="pt-2 border-t border-[var(--color-border)]/60 flex items-center justify-between gap-2">
            {canLike ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike?.(listing.id);
                }}
                aria-pressed={isLiked}
                aria-label={
                  isLiked
                    ? `إلغاء الإعجاب بالإعلان (${likesCount})`
                    : `الإعجاب بالإعلان (${likesCount})`
                }
                className={`min-h-[40px] px-3 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] ${
                  isLiked
                    ? 'bg-[var(--color-cream)] border-[var(--color-green-ink)] text-[var(--color-green-ink)]'
                    : 'bg-transparent border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-cream)]/60'
                }`}
              >
                <ThumbsUp
                  size={14}
                  aria-hidden="true"
                  className={isLiked ? 'fill-[var(--color-gold)] text-[var(--color-green-ink)]' : ''}
                />
                <span>{isLiked ? 'أعجبني' : 'إعجاب'}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums font-bold">{likesCount}</span>
              </button>
            ) : (
              <span className="text-xs text-[var(--color-muted)] inline-flex items-center gap-1.5 tabular-nums">
                <ThumbsUp size={13} aria-hidden="true" />
                <span>{likesCount} إعجاب</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => onSelect(listing)}
              className="min-h-[40px] px-2 text-xs font-semibold text-[var(--color-green-ink)] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              التفاصيل والأسئلة
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
