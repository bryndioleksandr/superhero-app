import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from '@/redux/store';
import {updateSuperhero, type ISuperhero, deleteSingleImage} from '@/redux/slices/superhero';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Upload } from 'lucide-react';

const formSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
  real_name: z.string().min(1, 'Real name is required'),
  origin_description: z.string().min(1, 'Origin description is required'),
  superpowers: z.string().min(1, 'Superpowers are required (comma-separated)'),
  catch_phrase: z.string().min(1, 'Catch phrase is required'),
});

type FormData = z.infer<typeof formSchema>;

interface EditSuperheroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hero: ISuperhero;
}

export default function EditSuperheroModal({ open, onOpenChange, hero }: EditSuperheroModalProps) {
  const dispatch = useDispatch();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: hero.nickname,
      real_name: hero.real_name,
      origin_description: hero.origin_description,
      superpowers: hero.superpowers?.join(', ') || '',
      catch_phrase: hero.catch_phrase,
    },
  });

  useEffect(() => {
    if (open && hero) {
      reset({
        nickname: hero.nickname,
        real_name: hero.real_name,
        origin_description: hero.origin_description,
        superpowers: hero.superpowers?.join(', ') || '',
        catch_phrase: hero.catch_phrase,
      });
      setExistingImages(hero.images || []);
      setSelectedImages([]);
      setImagePreviews([]);
    }
  }, [open, hero, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      alert('You can add a maximum of 5 new images');
      return;
    }
    setSelectedImages([...selectedImages, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (image: string) => {
    try {
      await dispatch(
          deleteSingleImage({
            id: hero._id,
            image,
          })
      ).unwrap();
      setExistingImages(existingImages.filter(item => item !== image));
      alert("Image deleted successfully.");
    } catch (e) {
      console.error("Error deleting image", e);
      alert("Failed to delete image");
    }
  };
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('nickname', data.nickname);
      formData.append('real_name', data.real_name);
      formData.append('origin_description', data.origin_description);
      formData.append('catch_phrase', data.catch_phrase);

      const superpowers = data.superpowers.split(',').map((s) => s.trim()).filter(Boolean);
      superpowers.forEach((power) => {
        formData.append('superpowers', power);
      });

      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      await dispatch(updateSuperhero({ id: hero._id, data: formData })).unwrap();
      setSelectedImages([]);
      setImagePreviews([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating superhero:', error);
      alert('Error updating superhero');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    setExistingImages(hero.images || []);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Superhero</DialogTitle>
          <DialogDescription>
            Update the superhero information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname *</Label>
            <Input
              id="nickname"
              {...register('nickname')}
              placeholder="Enter nickname"
            />
            {errors.nickname && (
              <p className="text-sm text-destructive">{errors.nickname.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="real_name">Real Name *</Label>
            <Input
              id="real_name"
              {...register('real_name')}
              placeholder="Enter real name"
            />
            {errors.real_name && (
              <p className="text-sm text-destructive">{errors.real_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="origin_description">Origin Description *</Label>
            <Textarea
              id="origin_description"
              {...register('origin_description')}
              placeholder="Enter origin description"
              rows={4}
            />
            {errors.origin_description && (
              <p className="text-sm text-destructive">{errors.origin_description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="superpowers">Superpowers *</Label>
            <Input
              id="superpowers"
              {...register('superpowers')}
              placeholder="e.g., Flight, Super Strength, Teleportation"
            />
            <p className="text-sm text-muted-foreground">
              Enter superpowers separated by commas
            </p>
            {errors.superpowers && (
              <p className="text-sm text-destructive">{errors.superpowers.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="catch_phrase">Catch Phrase *</Label>
            <Input
              id="catch_phrase"
              {...register('catch_phrase')}
              placeholder="Enter catch phrase"
            />
            {errors.catch_phrase && (
              <p className="text-sm text-destructive">{errors.catch_phrase.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Existing Images</Label>
            {existingImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mt-2">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExistingImage(image)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No existing images</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Add New Images (up to 5 files)</Label>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="image-upload-edit"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
              >
                <Upload className="h-4 w-4" />
                Select Images
              </Label>
              <Input
                id="image-upload-edit"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={selectedImages.length >= 5}
              />
              {selectedImages.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  Selected: {selectedImages.length}/5
                </span>
              )}
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeNewImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
