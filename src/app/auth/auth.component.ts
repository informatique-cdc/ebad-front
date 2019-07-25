import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {ApiService, Errors, UserService} from '../core';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  authType = '';
  title = '';
  errors: Errors = {errors: {}};
  isSubmitting = false;
  authForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;
      // Set a title for the page accordingly
      this.title = (this.authType === 'login') ? 'Connexion' : 'Inscription';
      // add form control for login if this is the register page
      if (this.authType === 'register') {
        this.authForm.addControl('usernname', new FormControl());
      }
    });
    console.log('csrf');
    this.apiService.get('/csrf').subscribe((result) => {
      console.log('ok ' + result);
    });

  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = {errors: {}};

    const credentials = this.authForm.value;
    this.userService
    .attemptAuth(this.authType, credentials)
    .subscribe(
      data => this.router.navigateByUrl('/'),
      err => {
        this.errors = err;
        this.isSubmitting = false;
      }
    );
  }
}
