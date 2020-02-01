import {Component, OnInit} from '@angular/core';
import {NewsService} from '../../core/services';
import {New} from '../../core/models';
import {Pageable} from "../../core/models/pageable.model";

@Component({
  selector: 'app-actuality-block',
  templateUrl: './actuality-block.component.html',
  styleUrls: ['./actuality-block.component.scss']
})
export class ActualityBlockComponent implements OnInit {

  news: New[] = [];

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    const pageable = new Pageable(0,10);
    pageable.sort = "id,desc";
    this.newsService.getAllPublic(pageable).subscribe(news => this.news = news.content);
  }

}
