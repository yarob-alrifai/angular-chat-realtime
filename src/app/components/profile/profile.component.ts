import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageUploadService } from '../../services/image-upload.service';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles:``
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  imageSrc: string | ArrayBuffer | null = 'https://i.pinimg.com/236x/97/7e/56/977e568da382e808209b9294e0c0c10a.jpg'
  user$ = this.userService.currentUserProfile$;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private imageService: ImageUploadService,
    private userService: UserService,
    private snackBar : SnackbarService
  ) {


    this.profileForm = this.fb.group({
      uid: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      photoURL: [null]
    });
  }

  ngOnInit(): void {
    //orange update the profile form  with user data
    this.user$.pipe(
    ).subscribe((user) => {
      if (user) {
        this.profileForm.patchValue({ ...user });
        if (user.photoURL) {
          this.imageSrc = user.photoURL;
        }
      }
    });
  }

  // green this fun use when select file
  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.selectedFile = file;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.profileForm.patchValue({
          photoURL: reader.result
        });
      };
    }
  }


  onSubmit() {
    const { uid, photoURL, ...data } = this.profileForm.value;
    if (!uid) {
      return;
    }

    this.snackBar.showLoading('Updating profile...');
    let uploadImage$ = of(photoURL);
    if (this.selectedFile) {

      uploadImage$ = this.imageService.uploadImage(this.selectedFile, `images/profile/${uid}`);
    }

    uploadImage$.pipe(
      switchMap((uploadedPhotoURL) => {
        const updatedUser = {
          uid,
          photoURL: uploadedPhotoURL,
          ...data
        };
        return this.userService.updateUser(updatedUser);
      })
    ).subscribe({
      next: () => {

        this.snackBar.showSuccess('Profile updated successfully');
      },
      error: (error) => {

        this.snackBar.showError(`Error updating profile: ${error}`);
        console.error('Error updating profile:', error);
      }
    });
  }
}
