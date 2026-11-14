/** Whitelist serializers: a field must be listed here to ever leave the server. */

export function toSelfUser(user: any) {
  if (!user) return null;
  return {
    id: user.id,
    phone: user.phone,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    phoneVerified: Boolean(user.phoneVerifiedAt),
  };
}

/** Public seller card. Contact details are only included for signed-in users. */
export function toPublicSeller(seller: any, viewerSignedIn: boolean) {
  const verificationStatus: 'Pending' | 'Verified' | 'Rejected' =
    seller.verificationStatus === 'Verified' ||
    (!seller.verificationStatus && Boolean(seller.verifiedAt))
      ? 'Verified'
      : seller.verificationStatus === 'Rejected'
      ? 'Rejected'
      : 'Pending';
  const verifiedAt = verificationStatus === 'Verified' ? seller.verifiedAt || null : null;

  const base = {
    userId: seller.userId,
    displayName: seller.displayName,
    bio: seller.bio,
    regionId: seller.regionId,
    city: seller.city,
    verificationStatus,
    verifiedAt,
    yearsExperience: seller.yearsExperience,
    specialty: seller.specialty,
    rating: seller.rating,
    ratingCount: seller.ratingCount,
    totalSales: seller.totalSales,
  };
  return viewerSignedIn ? { ...base, phone: seller.phone, whatsapp: seller.whatsapp } : base;
}

/** Minimal {id,name} directory entry for the other side of a conversation or offer. */
export function toDirectoryEntry(user: any) {
  return { id: user.id, name: user.name };
}
