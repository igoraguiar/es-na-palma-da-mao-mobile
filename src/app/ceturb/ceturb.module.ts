import { BusLinesComponent } from './bus-lines/bus-lines.component';
import { BusInfoComponent } from './bus-info/bus-info.component';
import { DestinationListComponent } from './transcol-online/destination-list/destination-list.component';
import { TranscolOnlineComponent } from './transcol-online/transcol-online.component';
import { TranscolFeedBackComponent } from './transcol-online/feedback/feedback.component';
import { StopIconComponent } from './transcol-online/stop-icon/stop-icon.component';
import { StopSummaryComponent } from './transcol-online/stop-summary/stop-summary.component';
import { RoutePrevisionsListComponent } from './transcol-online/route-previsions-list/route-previsions-list.component';
import { OriginPrevisionsListComponent } from './transcol-online/origin-previsions-list/origin-previsions-list.component';
import { LinePrevisionsListComponent } from './transcol-online/line-previsions-list/line-previsions-list.component';
import { MapLabelsComponent } from './transcol-online/map-labels/map-labels.component';
import { TranscolOnlineStorage } from './transcol-online/shared/index';
import { GeolocationComponent } from './transcol-online/geolocation/geolocation.component';
import { FavoritesSliderComponent } from './transcol-online/favorites-slider/favorites-slider.component';
import { TranscolOnlineApiService } from './transcol-online/shared/index';
import { CeturbStorage, CeturbApiService } from './shared/index';
import { BetaRibbonComponent } from './transcol-online/beta-ribbon/beta-ribbon.component';
import { FeedbackFormComponent } from './transcol-online/feedback/feedback-form/feedback-form.component';
import { FeedBackApiService } from './transcol-online/feedback/shared/feedback-api.service';

export default angular.module( 'ceturb.module', [] )

    // services
    .service( 'ceturbStorage', CeturbStorage )
    .service( 'transcolOnlineStorage', TranscolOnlineStorage )
    .service( 'transcolOnlineApiService', TranscolOnlineApiService )
    .service( 'ceturbApiService', CeturbApiService )
    .service( 'feedBackApiService', FeedBackApiService )

    // components
    .directive( 'busLines', BusLinesComponent )
    .directive( 'busInfo', BusInfoComponent )
    .directive( 'transcolOnline', TranscolOnlineComponent )
    .directive( 'transcolOnlineFeedback', TranscolFeedBackComponent )

    // widgets
    .component( 'favoritesSlider', FavoritesSliderComponent )
    .component( 'destinationList', DestinationListComponent )
    .component( 'stopIcon', StopIconComponent )
    .component( 'stopSummary', StopSummaryComponent )
    .component( 'routePrevisionsList', RoutePrevisionsListComponent )
    .component( 'originPrevisionsList', OriginPrevisionsListComponent )
    .component( 'linePrevisionsList', LinePrevisionsListComponent )
    .component( 'mapLabels', MapLabelsComponent )
    .component( 'geolocation', GeolocationComponent )
    .component( 'betaRibbon', BetaRibbonComponent )
    .component( 'feedbackForm', FeedbackFormComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.busLines', {
                    url: 'busLines',
                    views: {
                        content: {
                            template: '<bus-lines></bus-lines>'
                        }
                    }
                })
                .state( 'app.busInfo/:id', {
                    url: 'busInfo/:id',
                    views: {
                        content: {
                            template: '<bus-info></bus-info>'
                        }
                    }
                })
                .state( 'app.transcolOnline', {
                    url: 'transcolOnline',
                    cache: false,
                    views: {
                        content: {
                            template: '<transcol-online></transcol-online>'
                        }
                    }
                })
                .state( 'app.transcolOnlineFeedback', {
                    url: 'transcolOnlineFeedback',
                    views: {
                        content: {
                            template: '<transcol-online-feedback></transcol-online-feedback>'
                        }
                    }
                });
        }
    ] )
    .name;