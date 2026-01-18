import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from '@/redux/store';
import { createSuperhero } from '@/redux/slices/superhero';
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

interface CreateSuperheroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSuperheroModal({ open, onOpenChange }: CreateSuperheroModalProps) {
  const dispatch = useDispatch();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      alert('You can add a maximum of 5 images');
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

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

      await dispatch(createSuperhero(formData)).unwrap();
      reset();
      setSelectedImages([]);
      setImagePreviews([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating superhero:', error);
      alert('Error creating superhero');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedImages([]);
    setImagePreviews([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Superhero</DialogTitle>
          <DialogDescription>
            Fill in the form to create a new superhero
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
            <Label htmlFor="images">Images (up to 5 files)</Label>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
              >
                <Upload className="h-4 w-4" />
                Select Images
              </Label>
              <Input
                id="image-upload"
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
                      onClick={() => removeImage(index)}
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
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
