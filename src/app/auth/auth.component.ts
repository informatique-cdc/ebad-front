import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {ApiService, Errors, UserService} from '../core';
import {OauthService} from "../security/oauth.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  title = '';
  error = false;
  isSubmitting = false;
  authForm: FormGroup;
  jwt = environment.jwt;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private oauthService: OauthService
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.apiService.get('/csrf').subscribe((result) => {
      console.log('csrf');
    });

  }

  submitForm() {
    if(!this.jwt) {
      // this.oauthService.runInitialLoginSequence();
      this.oauthService.login("/home");
      //return;
    }else {

      this.isSubmitting = true;
      this.error = false;

      const credentials = this.authForm.value;
      this.userService
        .attemptAuth(credentials)
        .subscribe(
          data => this.router.navigateByUrl('/home'),
          err => {
            this.error = true;
            this.isSubmitting = false;
          }
        );
    }
  }
}
