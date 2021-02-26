import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {UserService} from '../../core/services';
import {RoleService} from '../../core/services/role.service';

@Directive({
    selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {
    // the role the user must have
    @Input() hasRole: string;

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
        private userService: UserService,
        private roleService: RoleService
    ) {
    }

    ngOnInit() {
        this.userService.currentUser.subscribe((us) => this.showHide(us));
    }

    showHide(user) {
        const roles = [];
        roles[0] = this.hasRole;

        if (this.roleService.hasRoleSearch(user, roles)) {
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
