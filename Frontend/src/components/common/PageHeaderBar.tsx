import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../ui/Icon';

interface PageHeaderBarProps {
  titleKey: string;
  iconName: string;
  breadcrumbLabel?: string;
  className?: string;
  rightContent?: React.ReactNode;
}

export const PageHeaderBar: React.FC<PageHeaderBarProps> = ({
  titleKey,
  iconName,
  breadcrumbLabel,
  className = '',
  rightContent,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className={`bg-[#222d32] text-white py-2.5 px-4 rounded-t-[4px] shadow-sm select-none ${className}`.trim()}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Icon name={iconName} className="w-4 h-4 text-white" />
          <h1 className="text-[15px] font-bold text-white tracking-wide">{t(titleKey)}</h1>
          {rightContent && <div className="pl-4">{rightContent}</div>}
        </div>
        <nav className="flex items-center space-x-1.5 text-[12px] text-gray-300">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer bg-transparent border-0 text-gray-300 text-[12px] font-medium"
          >
            <Icon name="fa-laptop" className="w-3.5 h-3.5" />
            <span>{t('Dashboard')}</span>
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-white font-medium">{t(breadcrumbLabel ?? titleKey)}</span>
        </nav>
      </div>
    </header>
  );
};
