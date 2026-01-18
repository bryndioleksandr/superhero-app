import { useNavigate } from 'react-router-dom';
import { type ISuperhero } from '@/redux/slices/superhero';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EditSuperheroModal from './modals/EditSuperheroModal';
import DeleteSuperheroModal from './modals/DeleteSuperheroModal';

interface SuperheroCardProps {
  hero: ISuperhero;
}

export default function SuperheroCard({ hero }: SuperheroCardProps) {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCardClick = () => {
    navigate(`/superhero/${hero._id}`);
  };

  const handleViewDetails = () => {
    navigate(`/superhero/${hero._id}`);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const imageUrl = hero.images && hero.images.length > 0 ? hero.images[0] : '/placeholder-hero.jpg';

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
            onClick={handleCardClick}
          >
            <AspectRatio ratio={4 / 3}>
              <img
                src={imageUrl}
                alt={hero.nickname}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-hero.jpg';
                }}
              />
            </AspectRatio>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg truncate">{hero.nickname}</h3>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </ContextMenuItem>
          <ContextMenuItem onSelect={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem variant="destructive" onSelect={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <EditSuperheroModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        hero={hero}
      />

      <DeleteSuperheroModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        heroId={hero._id}
        heroNickname={hero.nickname}
      />
    </>
  );
}
