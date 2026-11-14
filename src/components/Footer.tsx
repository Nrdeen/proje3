import type { User } from '../types/marketplace';
import { getRoleAwareFooterAccountLinks } from '../lib/marketplace-helpers';
import type { AuthMode, DashboardTab, PageView } from '../lib/router';

interface FooterProps {
  currentUser: User | null;
  onNavigate: (
    page: PageView,
    options?: { authMode?: AuthMode; dashboardTab?: DashboardTab }
  ) => void;
}

export function Footer({ currentUser, onNavigate }: FooterProps) {
  const accountLinks = getRoleAwareFooterAccountLinks(currentUser?.role ?? null);

  return (
    <footer className="bg-[var(--color-footer)] text-[#FAF6EC] border-t border-[var(--color-border)] mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          <div className="md:col-span-2">
            <p className="font-display text-xl font-extrabold text-white">سوق الغنم</p>
            <p className="mt-3 text-sm text-[#FAF6EC]/80 max-w-md leading-relaxed">
              منصة سعودية متخصصة لإعلانات المواشي، تجمع المربين والبائعين والمشترين في بيئة منظمة وواضحة بالأسعار الاسترشادية والمواصفات الدقيقة.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--color-gold)] mb-3">أقسام المنصة</p>
            <ul className="space-y-2 text-sm text-[#FAF6EC]/85">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('listings')}
                  className="hover:text-white cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                >
                  جميع الإعلانات
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('breeds')}
                  className="hover:text-white cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                >
                  دليل السلالات
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('breeders')}
                  className="hover:text-white cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                >
                  المربون والأسعار الاسترشادية
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('add')}
                  className="hover:text-white cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                >
                  أضف إعلانك
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--color-gold)] mb-3">
              {currentUser ? 'الحساب والخدمات' : 'حسابك في السوق'}
            </p>
            <ul className="space-y-2 text-sm text-[#FAF6EC]/85">
              {accountLinks.map((link) => (
                <li key={link.key}>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate(link.page, {
                        authMode: link.authMode,
                        dashboardTab: link.dashboardTab,
                      })
                    }
                    className="hover:text-white cursor-pointer text-right rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF6EC]/70">
          <p>© 2026 سوق الغنم — المملكة العربية السعودية. جميع الأسعار بالريال السعودي.</p>
          <p>منصة إعلانات مواشٍ متخصصة — النعيمي · النجدي · الحري · العارضي</p>
        </div>
      </div>
    </footer>
  );
}
