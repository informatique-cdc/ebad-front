import {AfterViewInit, Component} from '@angular/core';
import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'app-api-docs-page',
  templateUrl: './api-docs.component.html',
  styleUrls: ['./api-docs.component.css']
})
export class ApiDocsComponent implements AfterViewInit {

  constructor() {}

  ngAfterViewInit() {
    const ui = SwaggerUI({
      url: '/ebad/v3/api-docs',
      domNode: document.getElementById('swagger'),
      presets: [
        SwaggerUI.presets.apis
      ]
    });
  }

}
