import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleSuperhero } from '@/redux/slices/superhero';
import type {AppDispatch, RootState} from '@/redux/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useState } from 'react';
import EditSuperheroModal from '@/components/modals/EditSuperheroModal';
import DeleteSuperheroModal from '@/components/modals/DeleteSuperheroModal';

export default function SuperheroDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedHero, status } = useSelector((state: RootState) => state.superheroes);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleSuperhero(id));
    }
  }, [id, dispatch]);

  const handleEditSuccess = () => {
    if (id) {
      dispatch(fetchSingleSuperhero(id));
    }
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!selectedHero) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Superhero not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate('/')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to list
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl">{selectedHero.nickname}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Images</h3>
              {selectedHero.images && selectedHero.images.length > 0 ? (
                <div className="relative w-full max-w-md mx-auto">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {selectedHero.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <AspectRatio ratio={1}>
                            <img
                              src={image}
                              alt={`${selectedHero.nickname} ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-hero.jpg';
                              }}
                            />
                          </AspectRatio>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {selectedHero.images.length > 1 && (
                      <>
                        <CarouselPrevious className="left-[-2.5rem]" />
                        <CarouselNext className="right-[-2.5rem]" />
                      </>
                    )}
                  </Carousel>
                </div>
              ) : (
                <p className="text-muted-foreground">No images</p>
              )}
            </div>

            <div className="space-y-6 flex flex-col justify-center gap-10 mt-10">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Real Name</h3>
                <p className="text-lg">{selectedHero.real_name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Origin Description</h3>
                <p className="text-lg">{selectedHero.origin_description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Superpowers</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedHero.superpowers && selectedHero.superpowers.length > 0 ? (
                    selectedHero.superpowers.map((power, index) => (
                      <Badge key={index} variant="secondary">
                        {power}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No superpowers</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Catch Phrase</h3>
                <p className="text-lg italic">&quot;{selectedHero.catch_phrase}&quot;</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditSuperheroModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) handleEditSuccess();
        }}
        hero={selectedHero}
      />

      <DeleteSuperheroModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        heroId={selectedHero._id}
        heroNickname={selectedHero.nickname}
      />
    </div>
  );
}
