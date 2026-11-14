import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Phone, Star } from 'lucide-react';
import type {
  Breed,
  Listing,
  Region,
  SellerProfile,
  SellerReview,
  User,
} from '../types/marketplace';
import { formatRelativeArabicTime } from '../lib/format';
import { buildSellerContactLinks } from '../lib/marketplace-helpers';
import type { AuthMode } from '../lib/router';
import { ListingCard } from './ListingCard';
import { isSellerVerified, VerifiedSellerBadge } from './VerifiedSellerBadge';

interface SellerProfileViewProps {
  seller: SellerProfile;
  currentUser: User | null;
  listings: Listing[];
  breeds: Breed[];
  regions: Region[];
  favoriteIds: string[];
  likedListingIds?: string[];
  reviews: SellerReview[];
  onBack: () => void;
  onSelectListing: (listing: Listing) => void;
  onToggleFavorite: (listingId: string) => void;
  onToggleLike?: (listingId: string) => void;
  onRequireAuth?: (mode?: AuthMode) => void;
  onSubmitReview: (
    sellerId: string,
    payload: { rating: number; comment: string }
  ) => Promise<void>;
}

const RATING_LABELS: Record<number, string> = {
  1: 'ضعيف',
  2: 'مقبول',
  3: 'جيد',
  4: 'جيد جداً',
  5: 'ممتاز',
};

function StarDisplay({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        return (
          <Star
            key={star}
            size={size}
            className={
              filled
                ? 'text-[var(--color-gold)] fill-[var(--color-gold)]'
                : 'text-[var(--color-border)]'
            }
          />
        );
      })}
    </span>
  );
}

export function SellerProfileView({
  seller,
  currentUser,
  listings,
  breeds,
  regions,
  favoriteIds,
  likedListingIds = [],
  reviews,
  onBack,
  onSelectListing,
  onToggleFavorite,
  onToggleLike,
  onRequireAuth,
  onSubmitReview,
}: SellerProfileViewProps) {
  const sellerListings = listings.filter(
    (l) => l.sellerId === seller.userId && l.status === 'Published'
  );
  const sellerReviews = useMemo(
    () =>
      reviews
        .filter((r) => r.sellerId === seller.userId)
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
        ),
    [reviews, seller.userId]
  );

  const existingMyReview = useMemo(
    () => (currentUser ? sellerReviews.find((r) => r.reviewerId === currentUser.id) || null : null),
    [sellerReviews, currentUser?.id]
  );

  const [selectedRating, setSelectedRating] = useState<number>(existingMyReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(existingMyReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    setSelectedRating(existingMyReview?.rating || 5);
    setComment(existingMyReview?.comment || '');
    setFormError('');
    setSavedBanner(false);
  }, [seller.userId, existingMyReview?.id, existingMyReview?.rating, existingMyReview?.comment]);

  const isOwnProfile = !!currentUser && currentUser.id === seller.userId;
  const reviewCount = seller.ratingCount ?? sellerReviews.length;
  const averageRating =
    sellerReviews.length > 0
      ? Math.round(
          (sellerReviews.reduce((acc, r) => acc + r.rating, 0) / sellerReviews.length) * 10
        ) / 10
      : seller.rating;

  const breakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = sellerReviews.filter((r) => r.rating === stars).length;
      const pct = sellerReviews.length > 0 ? Math.round((count / sellerReviews.length) * 100) : 0;
      return { stars, count, pct };
    });
  }, [sellerReviews]);

  const activeStarValue = hoverRating || selectedRating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSavedBanner(false);
    if (selectedRating < 1 || selectedRating > 5) {
      setFormError('يرجى اختيار عدد النجوم من 1 إلى 5');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmitReview(seller.userId, {
        rating: selectedRating,
        comment: comment.trim(),
      });
      setSavedBanner(true);
    } catch (err: any) {
      setFormError(err?.message || 'تعذر حفظ التقييم');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-green-ink)] hover:underline mb-6 cursor-pointer"
        >
          <ArrowRight size={16} aria-hidden="true" />
          <span>العودة</span>
        </button>

        <div className="bg-[var(--color-cream)] rounded-xl border border-[var(--color-border)] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center flex-wrap gap-3 text-xs">
              <span className="text-[var(--color-muted)]">{seller.city}</span>
              {isSellerVerified(seller) && (
                <VerifiedSellerBadge variant="badge" label="مربي موثق في المنصة" />
              )}
              <span className="inline-flex items-center gap-1.5 text-[var(--color-ink)] font-semibold tabular-nums">
                <StarDisplay value={averageRating} size={14} />
                <span>{averageRating.toFixed(1)}</span>
                <span className="text-[var(--color-muted)] font-normal">
                  ({reviewCount} {reviewCount === 1 ? 'تقييم' : 'تقييمات'})
                </span>
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)]">
              {seller.displayName}
            </h1>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{seller.bio}</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shrink-0 space-y-2.5 w-full md:w-auto md:min-w-[240px]">
            <p className="text-xs text-[var(--color-muted)]">بيانات التواصل والمبيعات</p>
            {(() => {
              const contact = buildSellerContactLinks({
                isSignedIn: Boolean(currentUser),
                isOwner: isOwnProfile,
                seller,
                listingTitle: seller.displayName,
              });
              if (!currentUser) {
                return (
                  <div className="space-y-2">
                    <p className="text-xs text-[var(--color-muted)]">
                      بيانات الاتصال المباشر متاحة للأعضاء المسجلين فقط.
                    </p>
                    {onRequireAuth && (
                      <button
                        type="button"
                        onClick={() => onRequireAuth('login')}
                        className="w-full h-9 px-3 rounded-lg bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white text-xs font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                      >
                        تسجيل الدخول لعرض الرقم
                      </button>
                    )}
                  </div>
                );
              }
              return (
                <div className="space-y-2">
                  <p className="font-display text-lg font-bold text-[var(--color-green-ink)] tabular-nums flex items-center gap-2">
                    <Phone size={16} aria-hidden="true" />
                    <span dir="ltr">{seller.phone || 'غير متوفر'}</span>
                  </p>
                  {!isOwnProfile && (contact.telHref || contact.whatsappHref) && (
                    <div className="flex flex-wrap gap-2">
                      {contact.telHref && (
                        <a
                          href={contact.telHref}
                          aria-label={`اتصال هاتفي بالمربي ${seller.displayName}`}
                          className="h-9 px-3 rounded-lg bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white text-xs font-semibold inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                        >
                          <Phone size={13} aria-hidden="true" />
                          <span>اتصال</span>
                        </a>
                      )}
                      {contact.whatsappHref && (
                        <a
                          href={contact.whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`مراسلة المربي ${seller.displayName} عبر واتساب`}
                          className="h-9 px-3 rounded-lg border border-[var(--color-green-ink)] text-[var(--color-green-ink)] hover:bg-[var(--color-cream)] text-xs font-semibold inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                        >
                          <span>واتساب</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
            <p className="text-xs text-[var(--color-muted)] tabular-nums">
              التقييم العام: {averageRating.toFixed(1)} / 5 · إعلانات نشطة: {sellerListings.length}
            </p>
          </div>
        </div>
      </div>

      {/* Seller Listings */}
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--color-ink)] mb-6">
          إعلانات {seller.displayName} ({sellerListings.length})
        </h2>
        {sellerListings.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">لا توجد إعلانات نشطة حالياً لهذا المربي.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                breed={breeds.find((b) => b.id === listing.breedId)}
                region={regions.find((r) => r.id === listing.regionId)}
                seller={seller}
                isFavorite={favoriteIds.includes(listing.id)}
                isLiked={likedListingIds.includes(listing.id)}
                onSelect={onSelectListing}
                onToggleFavorite={onToggleFavorite}
                onToggleLike={onToggleLike}
              />
            ))}
          </div>
        )}
      </div>

      {/* Star Rating & Buyer Reviews Section */}
      <div className="pt-8 border-t border-[var(--color-border)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Summary + Rating Submission Form */}
        <div className="lg:col-span-5 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">
              تقييم المربي وآراء المشترين
            </h2>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              شارك تجربتك في التعامل وجودة الحلال لمساعدة المشترين الآخرين.
            </p>
          </div>

          {/* Aggregate Rating Score & Bars */}
          <div className="flex items-center gap-5 pb-5 border-b border-[var(--color-border)]">
            <div className="text-center shrink-0">
              <p className="font-display text-4xl font-extrabold text-[var(--color-green-ink)] tabular-nums">
                {averageRating.toFixed(1)}
              </p>
              <div className="mt-1">
                <StarDisplay value={averageRating} size={15} />
              </div>
              <p className="text-[11px] text-[var(--color-muted)] tabular-nums mt-1">
                من أصل {reviewCount} {reviewCount === 1 ? 'تقييم' : 'تقييمات'}
              </p>
            </div>

            <div className="flex-1 space-y-1.5">
              {breakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-[var(--color-muted)] tabular-nums shrink-0">
                    {row.stars} ★
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[var(--color-cream)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-gold)] rounded-full transition-all"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-left text-[var(--color-muted)] tabular-nums shrink-0">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Star Rating Form */}
          {isOwnProfile ? (
            <p className="text-xs text-[var(--color-muted)] bg-[var(--color-cream)] border border-[var(--color-border)] rounded-lg p-3.5 leading-relaxed">
              أنت تشاهد ملف مراحك الشخصي، ولا يمكنك تقييم نفسك.
            </p>
          ) : !currentUser ? (
            <p className="text-xs text-[var(--color-muted)] bg-[var(--color-cream)] border border-[var(--color-border)] rounded-lg p-3.5 leading-relaxed">
              سجّل الدخول لإضافة تقييم لهذا المربي.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <p className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
                  {formError}
                </p>
              )}
              {savedBanner && (
                <p className="p-2.5 rounded-lg bg-[var(--color-cream)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-green-ink)]">
                  تم حفظ تقييمك وتحديث متوسط تقييم المربي بنجاح.
                </p>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[var(--color-ink)]">
                    تقييمك ({currentUser.name})
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-gold)] tabular-nums">
                    {activeStarValue} / 5 — {RATING_LABELS[activeStarValue]}
                  </span>
                </div>

                <div
                  className="flex items-center gap-1.5"
                  role="radiogroup"
                  aria-label="اختيار التقييم بالنجوم"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= activeStarValue;
                    return (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={selectedRating === star}
                        aria-label={`${star} ${star === 1 ? 'نجمة' : 'نجوم'} - ${RATING_LABELS[star]}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onClick={() => setSelectedRating(star)}
                        className="p-1.5 rounded-lg hover:bg-[var(--color-cream)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                      >
                        <Star
                          size={24}
                          className={
                            active
                              ? 'text-[var(--color-gold)] fill-[var(--color-gold)] transition-transform scale-105'
                              : 'text-[var(--color-border)] transition-colors'
                          }
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="seller-review-comment"
                  className="block text-xs font-medium text-[var(--color-muted)] mb-1.5"
                >
                  تعليقك على التجربة (اختياري)
                </label>
                <textarea
                  id="seller-review-comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="اكتب رأيك حول جودة الحلال، دقة المواصفات، وسرعة التواصل..."
                  className="w-full p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)]/40 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/75 focus:outline-none focus:border-[var(--color-green-ink)]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-lg bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
              >
                {submitting
                  ? 'جاري الحفظ...'
                  : existingMyReview
                  ? 'تحديث تقييمك'
                  : 'إرسال التقييم'}
              </button>
            </form>
          )}
        </div>

        {/* Buyer Reviews Feed */}
        <div className="lg:col-span-7 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <h3 className="font-display text-lg font-bold text-[var(--color-ink)] pb-4 border-b border-[var(--color-border)]">
            سجل تقييمات المشترين ({sellerReviews.length})
          </h3>

          {sellerReviews.length === 0 ? (
            <p className="py-8 text-sm text-[var(--color-muted)] text-center">
              لا توجد تقييمات مسجلة لهذا المربي حتى الآن. كن أول من يشارك تجربته.
            </p>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {sellerReviews.map((review) => (
                <article key={review.id} className="py-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-display text-sm font-bold text-[var(--color-ink)]">
                        {review.reviewerName}
                      </span>
                      <span aria-hidden="true" className="text-[var(--color-muted)]">
                        ·
                      </span>
                      <span className="text-[var(--color-muted)]">
                        {formatRelativeArabicTime(review.updatedAt || review.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <StarDisplay value={review.rating} size={14} />
                      <span className="text-xs font-bold text-[var(--color-ink)] tabular-nums">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-[var(--color-ink)]/90 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
