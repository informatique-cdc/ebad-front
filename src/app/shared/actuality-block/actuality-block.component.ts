import { Component, OnInit } from '@angular/core';
import {NewsService} from '../../core/services';
import {New} from '../../core/models';

@Component({
  selector: 'app-actuality-block',
  templateUrl: './actuality-block.component.html',
  styleUrls: ['./actuality-block.component.scss']
})
export class ActualityBlockComponent implements OnInit {

  news: New[] = [];

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.newsService.getAllPublic().subscribe(news => this.news = news);
  }

}
