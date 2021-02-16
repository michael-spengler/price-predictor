import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { zip } from 'rxjs';
import { BlogPostService } from '../../../shared/services/blog-post/blog-post.service';
import { TradeService } from '../../../shared/services/trade/trade.service';
import { Trade } from '../../../shared/models/trade.model';
import { BlogPost } from '../../../shared/models/blog-post.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  user = {
    "username": "Angela Merkel",
    "user_id": "bundesregierung",
    "join_date": "2008-02-01",
    "posts": 213,
    "trades": 361,
    "follower": 175,
    "correct_trades": 123,
    "wrong_trades": 22,
    "links": [
      {
        "name": "Facebook",
        "link": "https://www.facebook.com/Bundesregierung/"
      },
      {
        "name": "Twitter",
        "link": "https:///www.twitter.com/cdumerkel"
      }
    ]
  };

  allFeed: (BlogPost | Trade)[] = [];
  tradeFeed: Trade[] = [];
  blogPostFeed: BlogPost[] = [];
  id: String = "";

  constructor(private route: ActivatedRoute, private blogPostService: BlogPostService, private tradeService: TradeService) {
    this.trade_data = this.genTradeData();
  }

  
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');
      if (id != null) {
        this.id = id;
        console.log(this.id);
      }
    })
    zip(
      this.tradeService.getTradesByAuthor('test'),
      this.blogPostService.getPostsByAuthor('test')
    ).subscribe(([trades, blogPosts]: [Trade[], BlogPost[]]) => {
      this.blogPostFeed = blogPosts;
      this.sortByDate(this.blogPostFeed);

      this.tradeFeed = trades;
      this.sortByDate(this.tradeFeed);

      this.allFeed = this.blogPostFeed;
      this.allFeed = this.allFeed.concat(this.tradeFeed);
      this.sortByDate(this.allFeed);
    });
  }

  trade_data;

  private genTradeData() {
    let correct_trades = this.user.correct_trades;
    let wrong_trades = this.user.wrong_trades;
    let open_trades = this.user.trades - correct_trades - wrong_trades;
    return [
      {
        "name": "Correct",
        "value": correct_trades,
      },
      {
        "name": "Wrong",
        "value": wrong_trades,
      },
      {
        "name": "Open",
        "value": open_trades,
      }
    ];
  }

  private sortByDate(feed: (BlogPost | Trade)[]) {
    feed.sort((a, b) => {
      if (a.date != undefined && b.date != undefined) {
        return (a.date > b.date) ? -1 : 1
      } else return -1;
    });
  }

  trade_chart = {
    "type": ChartType.ColumnChart,
    "data": [
      [
        "Correct", 123
      ],
      [
        "Wrong", 243
      ],
      [
        "Open", 13
      ]
    ],
    "options": {
      "backgroundColor": {
        "fill": "transparent",
      },
      "legend": {
        "textStyle": {
          "color": "white"
        }
      }
    },
    "dynamicResize": true,
  }

  portfolio_chart = {
    "type": ChartType.PieChart,
    "data": [
      [
        "BTC", 32100
      ],
      [
        "ETH", 4200
      ],
      [
        "USD", 10123.23
      ],
      [
        "EUR", 5012.123
      ]
    ],
    "options": {
      "backgroundColor": {
        "fill": "transparent",
      },
      "legend": {
        "textStyle": {
          "color": "white"
        }
      }
    },
    "dynamicResize": true,
  }
}
