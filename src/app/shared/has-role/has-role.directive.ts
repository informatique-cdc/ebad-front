import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {Subject} from "rxjs";
import {UserService} from "../../core/services";

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {
  // the role the user must have
  @Input() hasRole: string;

  stop$ = new Subject();

  isVisible = false;

  /**
   * @param {ViewContainerRef} viewContainerRef
   *  -- the location where we need to render the templateRef
   * @param {TemplateRef<any>} templateRef
   *   -- the templateRef to be potentially rendered
   * @param {UserService} userService
   *   -- will give us access to the current user
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    const roles = this.userService.getCurrentUser().authorities;
    console.log('user = ', this.userService.getCurrentUser());
    console.log('roles = ', roles);
    console.log('hasrole = ', this.hasRole);

    if (!roles) {
      this.viewContainerRef.clear();
    }
    const hasThisRole = this.hasRole;
    if (roles.find(function (obj: any) {
      return obj.name === hasThisRole;
    })) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear();
    }
  }
}
