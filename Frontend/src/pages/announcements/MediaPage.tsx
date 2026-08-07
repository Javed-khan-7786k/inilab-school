import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../../components/ui/Icon';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSearchAndFilter } from '../../hooks/useSearchAndFilter';

interface MediaItem {
  id: number;
  name: string;
  type: 'folder' | 'image' | 'video';
  size: string;
  itemsCount?: number;
  thumbnail?: string;
  updatedAt: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  { id: 1, name: "Class Photos", type: "folder", size: "1.2 GB", itemsCount: 45, updatedAt: "2026-07-10" },
  { id: 2, name: "Event Videos", type: "folder", size: "3.4 GB", itemsCount: 12, updatedAt: "2026-07-12" },
  { id: 3, name: "Sports Day", type: "folder", size: "850 MB", itemsCount: 28, updatedAt: "2026-07-14" },
  { id: 4, name: "School_Logo.png", type: "image", size: "120 KB", thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200", updatedAt: "2026-07-15" },
  { id: 5, name: "Campus_Tour.mp4", type: "video", size: "24.5 MB", updatedAt: "2026-07-16" }
];

export const MediaPage: React.FC = () => {
  const { t } = useLanguage();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA);

  const filterFn = (item: MediaItem, term: string) =>
    item.name.toLowerCase().includes(term.toLowerCase());

  const {
    searchTerm,
    setSearchTerm,
    sortedData: filteredItems
  } = useSearchAndFilter<MediaItem>({
    initialData: mediaItems,
    filterFn,
    initialSortField: 'id',
    initialSortOrder: 'asc'
  });

  // Keep hook synchronised when list items are added/deleted
  React.useEffect(() => {
    // Search hook updates list when mediaItems change
  }, [mediaItems]);

  const handleUpload = () => {
    const fileName = prompt(t("Enter file name to upload:"));
    if (fileName) {
      const isVideo = fileName.endsWith('.mp4') || fileName.endsWith('.mov');
      const isImg = fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
      
      const newMedia: MediaItem = {
        id: mediaItems.length > 0 ? Math.max(...mediaItems.map(m => m.id)) + 1 : 1,
        name: fileName,
        type: isVideo ? "video" : isImg ? "image" : "folder",
        size: isVideo ? "15.0 MB" : isImg ? "450 KB" : "0 bytes",
        itemsCount: isVideo || isImg ? undefined : 0,
        thumbnail: isImg ? "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200" : undefined,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setMediaItems(prevItems => [...prevItems, newMedia]);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this media item?")) {
      setMediaItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden">
        <PageHeaderBar titleKey="Media" iconName="fa-camera" />

        {/* Main Content Area */}
        <div className="p-[15px]">
          {/* Uploader drag and drop & controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 select-none">
            {/* Drag & Drop Card Uploader Area */}
            <div
              onClick={handleUpload}
              className="md:col-span-3 border-2 border-dashed border-[#dfe6e9] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-teal hover:bg-[#fafafa] transition-all group"
            >
              <Icon name="fa-camera" className="w-10 h-10 text-muted group-hover:text-teal transition-colors mb-2" />
              <p className="text-[13px] font-semibold text-dark">{t("Drag and drop files here or click to upload")}</p>
              <span className="text-[11px] text-muted mt-1">{t("Support images, videos, and folders")}</span>
            </div>

            {/* Filter Search Card */}
            <div className="border border-[#e7eaec] bg-[#f8f9fa] rounded-lg p-4 flex flex-col justify-between gap-3">
              <Input
                label={t("Search Media")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("Filter by name...")}
              />
              <Button
                variant="success"
                onClick={handleUpload}
                className="w-full uppercase tracking-wider text-[12px]"
              >
                {t("New Folder / File")}
              </Button>
            </div>
          </div>

          {/* Media Grid Lists */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted text-[13px]">
                {t("No media items found")}
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white hover:shadow-md transition-shadow group relative"
                >
                  {/* Thumbnail / Icon container */}
                  <div className="h-28 bg-[#fdfdfd] flex items-center justify-center border-b border-[#f0f0f0]">
                    {item.type === 'folder' ? (
                      <Icon name="fa-folder" className="w-12 h-12 text-[#f39c12]" />
                    ) : item.type === 'video' ? (
                      <Icon name="fa-film" className="w-12 h-12 text-teal" />
                    ) : (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Info details */}
                  <div className="p-3 text-center">
                    <p className="text-[12px] font-semibold text-dark truncate" title={item.name}>
                      {item.name}
                    </p>
                    <span className="text-[10px] text-muted">
                      {item.type === 'folder' ? `${item.itemsCount} ${t("items")}` : item.size}
                    </span>
                  </div>

                  {/* Delete hovering option */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="absolute top-1 right-1 p-1 bg-iconred hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0 shadow-sm"
                  >
                    <Icon name="fa-trash" className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
