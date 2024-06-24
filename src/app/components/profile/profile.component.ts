import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageUploadService } from '../../services/image-upload.service';
import { ProfileUser } from '../../models/user';
import { switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  imageSrc: string | ArrayBuffer | null = '/assets/image-profile.png';
  user$ = this.userService.currentUserProfile$;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private imageService: ImageUploadService,
    private userService: UserService
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


  // green
  onSubmit() {
    const { uid, photoURL, ...data } = this.profileForm.value;
    if (!uid) {
      return;
    }
    let uploadImage$ = of(photoURL);
    if (this.selectedFile) {
      //green If a new image file is selected, upload it
      uploadImage$ = this.imageService.uploadImage(this.selectedFile, `images/profile/${uid}`);
    }
    uploadImage$.pipe(
      switchMap((uploadedPhotoURL) => {
        const updatedUser: ProfileUser = {
          uid,
          photoURL: uploadedPhotoURL,
          ...data
        };
        return this.userService.updateUser(updatedUser);
      })
    ).subscribe({
      next: () => console.log('Profile updated successfully'),
      error: (error) => console.error('Error updating profile:', error)
    });
  }
}
