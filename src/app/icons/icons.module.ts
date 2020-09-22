import {NgModule} from '@angular/core';
import {FeatherModule} from "angular-feather";
import {
  Activity,
  BarChart2, Bell, BellOff, Calendar, CheckCircle, Code, Edit,
  Flag,
  Folder, GitCommit,
  Home,
  Inbox,
  Layers, LifeBuoy,
  Link, Plus,
  Server,
  Terminal,
  Users, X, XCircle
} from "angular-feather/icons";

const icons = {
  Home,
  BarChart2,
  Folder,
  Terminal,
  Link,
  Activity,
  Server,
  Inbox,
  Layers,
  Flag,
  Users,
  LifeBuoy,
  GitCommit,
  Calendar,
  Code,
  Bell,
  BellOff,
  X,
  Edit,
  XCircle,
  CheckCircle,
  Plus
};

@NgModule({
  imports: [
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule {
}
