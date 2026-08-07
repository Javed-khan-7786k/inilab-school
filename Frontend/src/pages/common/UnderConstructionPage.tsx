import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { Icon } from '../../components/ui/Icon';
import { Button } from '../../components/ui/Button';

interface UnderConstructionPageProps {
  title?: string;
  iconName?: string;
}

export const UnderConstructionPage: React.FC<UnderConstructionPageProps> = ({
  title,
  iconName = 'fa-wrench',
}) => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Derive human readable title from path if not explicitly provided
  const formatTitleFromPath = (pathname: string): string => {
    if (title) return title;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Page';
    
    // Ignore 'dashboard' segment if present
    const relevantSegments = segments.filter((s) => s.toLowerCase() !== 'dashboard');
    if (relevantSegments.length === 0) return 'Dashboard Module';

    return relevantSegments
      .map((seg) => seg.replace(/-/g, ' '))
      .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
      .join(' / ');
  };

  const pageTitle = formatTitleFromPath(location.pathname);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden">
        <PageHeaderBar
          titleKey={pageTitle}
          iconName={iconName}
          breadcrumbLabel={pageTitle}
        />

        <div className="p-6 md:p-10 bg-bodyBg min-h-[calc(100vh-180px)] flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg border border-[#e1e1e1] shadow-md max-w-2xl w-full p-8 text-center relative overflow-hidden">
            {/* Top color accent strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1ab394] via-[#f8ac59] to-[#ed5565]" />

            {/* Icon Group */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-full bg-[#fef9e7] border-2 border-[#f8ac59] flex items-center justify-center text-[#f8ac59] shadow-inner mx-auto">
                <Icon name="fa-wrench" className="text-3xl animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1ab394] text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
                <Icon name="fa-cog" className="animate-spin text-sm" />
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#fff8e1] text-[#b78103] border border-[#ffe082] uppercase tracking-wider shadow-2xs">
                <Icon name="fa-[#exclamation-triangle]" className="text-xs" />
                {t('Under Construction')}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-[#444] mb-3">
              {pageTitle} {t('Module')}
            </h1>

            {/* Description */}
            <p className="text-sm text-[#676a6c] leading-relaxed max-w-lg mx-auto mb-8">
              {t(
                'This menu item and module is currently under active setup and design. Specific field requirements, database integrations, and workflow features will be enabled soon.'
              )}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#eee]">
              <Button
                type="button"
                variant="success"
                className="bg-[#1ab394] hover:bg-[#18a689] text-white flex items-center gap-2 px-5 py-2 text-xs font-medium shadow-sm"
                onClick={() => navigate('/dashboard')}
              >
                <Icon name="fa-dashboard" />
                <span>{t('Back to Dashboard')}</span>
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="flex items-center gap-2 px-5 py-2 text-xs font-medium"
                onClick={() => navigate(-1)}
              >
                <Icon name="fa-arrow-left" />
                <span>{t('Go Back')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
