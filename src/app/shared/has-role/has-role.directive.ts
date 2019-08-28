import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {UserService} from "../../core/services";
import {User} from "../../core/models";

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {
  // the role the user must have
  @Input() hasRole: string;

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
    this.user = this.userService.getCurrentUser();

    if (this.hasThisRole(this.hasRole)) {
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
    for (const usageApp of this.user.usageApplications) {
      if (usageApp.canManage) {
        return true;
      }
    }
    return false;
  }

  isUser(): boolean {
    for (const usageApp of this.user.usageApplications) {
      if (usageApp.canUse) {
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

    const result = roles.find(function (obj: any) {
      return obj.name === role;
    });

    return result !== undefined;
  }
}
