import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ApiService, UserService} from '../core';
import {OauthService} from '../security/oauth.service';
import {ConfigService} from '../core/services/config.service';

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
  jwt: boolean;
  referer = '/home';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private oauthService: OauthService,
    private configService: ConfigService
  ) {
    this.jwt = this.configService.jwt;
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.referer){
        this.referer = params.referer;
      }
    });
    this.apiService.get('/csrf').subscribe(() => {
      console.debug('csrf');
    });

  }

  submitForm() {
    if (!this.jwt) {
      this.oauthService.login(this.referer);
    }else {
      this.isSubmitting = true;
      this.error = false;

      const credentials = this.authForm.value;
      this.userService
        .attemptAuth(credentials)
        .subscribe({
          next: () => this.router.navigateByUrl(this.referer),
          error: () => {
            this.error = true;
            this.isSubmitting = false;
          }
        });
    }
  }
}
