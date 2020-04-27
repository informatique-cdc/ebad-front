import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {UserService} from "../../core/services";
import {User} from "../../core/models";

@Directive({
  selector: '[hasAnyRole]'
})
export class HasAnyRoleDirective implements OnInit {
  // the role the user must have
  @Input() hasAnyRole: string[];

  isVisible = false;
  private user: User;

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
    this.userService.currentUser.subscribe((us) => this.hasRoleSearch(us));
  }

  hasRoleSearch(user){
    let hasRole  = false;
    this.user = user;
    this.hasAnyRole.forEach(role => {
      hasRole = hasRole || this.hasThisRole(role);
    });

    if (hasRole) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear();
    }
  }

  isModo(): boolean {
    if(this.user.usageApplications === undefined){
      return false;
    }
    for (const usageApp of this.user.usageApplications) {
      if (usageApp.canManage) {
        return true;
      }
    }
    return false;
  }

  hasThisRole(role: String): boolean {
    const roles = this.user.authorities;
    if (role === "ROLE_MODO") {
      return this.isModo();
    }

    if(roles === undefined){
      return false;
    }

    const result = roles.find(function (obj: any) {
      return obj.name === role;
    });

    return result !== undefined;
  }
}
