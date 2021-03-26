import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ApiService, JwtService, UserService} from '../core';
import {OauthService} from '../security/oauth.service';
import {ConfigService} from "../core/services/config.service";

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
    private jwtService: JwtService,
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
    const token: string = this.route.snapshot.queryParamMap.get('token');
    const error: string = this.route.snapshot.queryParamMap.get('error');

    console.log(token);
    console.log(error);


    this.route.params.subscribe(params => {
      if (params.referer){
        this.referer = params.referer;
      }
    });
    this.apiService.get('/csrf').subscribe(() => {
      console.debug('csrf');
    });

    if(token){
      this.jwtService.saveToken(token);
      this.userService.populate();
    }

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
        .subscribe(
          () => this.router.navigateByUrl(this.referer),
          () => {
            this.error = true;
            this.isSubmitting = false;
          }
        );
    }
  }
}
