import { useDispatch } from '@/redux/store';
import { deleteSuperhero, fetchSuperheroes } from '@/redux/slices/superhero';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface DeleteSuperheroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heroId: string;
  heroNickname: string;
}

export default function DeleteSuperheroModal({
  open,
  onOpenChange,
  heroId,
  heroNickname,
}: DeleteSuperheroModalProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteSuperhero(heroId)).unwrap();
      dispatch(fetchSuperheroes(1));
      onOpenChange(false);
      navigate('/');
    } catch (error) {
      console.error('Error deleting superhero:', error);
      alert('Error deleting superhero');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Superhero?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the superhero &quot;{heroNickname}&quot;? 
            This action cannot be undone and all data will be permanently lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
