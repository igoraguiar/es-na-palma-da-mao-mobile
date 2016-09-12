/*
 eslint
 no-undef: 0,
 dot-notation: 0,
 angular/di: 0,
 no-unused-expressions: 0
 */
import moment from 'moment';
import DriverLicenseStatusComponent from './driver-license-status.component';
import DriverLicenseStatusTemplate from './driver-license-status.component.html';
import { DriverLicenseStatusController } from './driver-license-status.component.controller';
import { DriverData, Ticket, DriverStatus, DetranApiService, TicketColorService, DriverLicenseStorage } from '../shared/index';

let expect = chai.expect;

/**
 *
 * Referência de unit-tests em angularjs:
 * http://www.bradoncode.com/tutorials/angularjs-unit-testing/
 */
describe( 'Detran/driver-license-status', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach( () => sandbox = sinon.sandbox.create() );
    afterEach( () => sandbox.restore() );

    let defaultExpirationDate = moment().add( 1, 'year' ).toDate();

    let driverDataOk: DriverData = {
        acquiringLicense: false,
        blockMotive: '',
        expirationDate: defaultExpirationDate,
        hasAdministrativeIssues: false,
        hasTickets: true,
        status: DriverStatus.Ok
    };

    let driverDataBlocked: DriverData = {
        acquiringLicense: false,
        blockMotive: '',
        expirationDate: defaultExpirationDate,
        hasAdministrativeIssues: false,
        hasTickets: true,
        status:  DriverStatus.Blocked
    };

    let driverDataExpired: DriverData = {
        acquiringLicense: false,
        blockMotive: '',
        expirationDate: moment().subtract( 31, 'days' ).toDate(),
        hasAdministrativeIssues: false,
        hasTickets: true,
        status: DriverStatus.Ok
    };

    let driverDataExpiring: DriverData = {
        acquiringLicense: false,
        blockMotive: '',
        expirationDate: moment().subtract( 30, 'days' ).toDate(),
        hasAdministrativeIssues: false,
        hasTickets: true,
        status: DriverStatus.Ok
    };

    let tickets: Ticket[] = [ {
            classification: 'MÉDIA',
            date: moment().subtract( 1, 'month' ).toDate(),
            description: 'ESTACIONAR O VEÍCULO EM LOCAIS E HORÁRIOS PROIBIDOS ESPECIFICAMENTE PELA SINALIZAÇÃO (PLACA - PROIBIDO ESTACIONAR).',
            district: 'VITORIA',
            place: 'R. DR. MOACYR GONCALVES',
            plate: 'MQH9400',
            points: 4,
            warning: false
        },
        {
            classification: 'GRAVE',
            date: moment().subtract( 2, 'months' ).toDate(),
            description: 'ESTACIONAR O VEÍCULO EM LOCAIS E HORÁRIOS PROIBIDOS ESPECIFICAMENTE PELA SINALIZAÇÃO (PLACA - PROIBIDO ESTACIONAR).',
            district: 'VITORIA',
            place: 'R. DR. MOACYR GONCALVES',
            plate: 'MQH9400',
            points: 7,
            warning: false
        },
        {
            classification: 'MÉDIA',
            date: moment().subtract( 3, 'months' ).toDate(),
            description: 'ESTACIONAR O VEÍCULO EM LOCAIS E HORÁRIOS PROIBIDOS ESPECIFICAMENTE PELA SINALIZAÇÃO (PLACA - PROIBIDO ESTACIONAR).',
            district: 'VITORIA',
            place: 'R. DR. MOACYR GONCALVES',
            plate: 'MQH9400',
            points: 2,
            warning: false
        },
        {
            classification: 'MÉDIA',
            date: moment().subtract( 2, 'years' ).toDate(),
            description: 'ESTACIONAR O VEÍCULO EM LOCAIS E HORÁRIOS PROIBIDOS ESPECIFICAMENTE PELA SINALIZAÇÃO (PLACA - PROIBIDO ESTACIONAR).',
            district: 'VITORIA',
            place: 'R. DR. MOACYR GONCALVES',
            plate: 'MQH9400',
            points: 5,
            warning: false
        } ];

    describe( 'Controller', () => {

        let $scope;
        let $mdDialog;
        let $q;
        let controller: DriverLicenseStatusController;
        let onIonicBeforeEnterEvent;
        let detranApiService: DetranApiService;
        let ticketColorService: TicketColorService;
        let driverLicenseStorage: DriverLicenseStorage;

        beforeEach( () => {
            $scope = {
                $on: ( event, callback ) => {
                    if ( event === '$ionicView.beforeEnter' ) {
                        onIonicBeforeEnterEvent = callback;
                    }
                }
            };
            driverLicenseStorage = <DriverLicenseStorage>{ driverLicense: {}, hasDriverLicense: false };
            $mdDialog = sandbox.stub();
            $q = sandbox.stub();
            detranApiService = <DetranApiService>{
                getDriverData() {},
                getDriverTickets() {}
            };

            ticketColorService = new TicketColorService();

            controller = new DriverLicenseStatusController( $scope, $q, ticketColorService, detranApiService, driverLicenseStorage, $mdDialog );
        } );

        describe( 'on instantiation', () => {
            it( 'should activate on $ionicView.beforeEnter event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                onIonicBeforeEnterEvent();

                expect( activate.calledOnce ).to.be.true;
            } );

            it( 'driverData should be "undefined"', () => {
                expect( controller.driverData ).to.be.undefined;
            } );

            it( 'tickets should be "undefined"', () => {
                expect( controller.tickets ).to.be.undefined;
            } );

            it( 'expirationDate should be "undefined"', () => {
                expect( controller.expirationDate ).to.be.undefined;
            } );

            it( 'licenseRenew should be "false"', () => {
                expect( controller.licenseRenew ).to.be.false;
            } );

            it( 'licenseExpired should be "false"', () => {
                expect( controller.licenseExpired ).to.be.false;
            } );

            it( 'licenseBlocked should be "false"', () => {
                expect( controller.licenseBlocked ).to.be.false;
            } );

            it( 'licenseOk should be "false"', () => {
                expect( controller.licenseOk ).to.be.false;
            } );
        } );

        describe( 'activate()', () => {

            let getDriverDataController: Sinon.SinonStub;
            let getDriverTicketsController: Sinon.SinonStub;

            beforeEach( () => {
                getDriverDataController = sandbox.stub( controller, 'getDriverData' );
                getDriverTicketsController = sandbox.stub( controller, 'getDriverTickets' );
                controller.activate();
            } );

            it( 'should call getDriverData()', () => {
                expect( getDriverDataController.calledOnce ).to.be.true;
            } );

            it( 'should call getDriverTickets()', () => {
                expect( getDriverTicketsController.calledOnce ).to.be.true;
            } );
        } );


         describe( 'getDriverData()', () => {

                let getDriverDataApi: Sinon.SinonStub;

                beforeEach( () => {
                    getDriverDataApi = sandbox.stub( detranApiService, 'getDriverData' );
                    getDriverDataApi.returnsPromise().resolves( driverDataOk );
                    controller.getDriverData();
                } );

                it( 'should call "detranApiService.getDriverData()"', () => {
                    expect( getDriverDataApi.calledOnce ).to.be.true;
                } );

                it( 'should populate driverData property', () => {
                    expect( controller.driverData ).to.not.be.undefined;
                    expect( controller.driverData ).to.be.equal( driverDataOk );
                } );

                it( 'should not populate driverData property on error', () => {
                    controller.driverData = driverDataOk;
                    getDriverDataApi.returnsPromise().rejects();
                    controller.getDriverData().then( () => {
                        expect( controller.driverData ).to.be.undefined;
                    } );
                } );
            } );

            describe( 'getDriverTickets()', () => {

                let getDriverTicketsApi: Sinon.SinonStub;

                beforeEach( () => {
                    getDriverTicketsApi = sandbox.stub( detranApiService, 'getDriverTickets' );
                    getDriverTicketsApi.returnsPromise().resolves( tickets );
                    controller.getDriverTickets();
                } );

                it( 'should call "detranApiService.getDriverTickets()"', () => {
                    expect( getDriverTicketsApi.calledOnce ).to.be.true;
                } );

                it( 'should populate tickets property', () => {
                    expect( controller.tickets ).to.not.be.undefined;
                    expect( controller.tickets ).to.be.equal( tickets );
                } );

                it( 'should not populate tickets property on error', () => {
                    controller.tickets = tickets;
                    getDriverTicketsApi.returnsPromise().rejects();
                    controller.getDriverTickets().then( () => {
                        expect( controller.tickets ).to.be.undefined;
                    } );
                } );
            } );

        describe( 'Properties', () => {

            describe( 'licenseOk', () => {
                it( 'should return true if has driverData and status === DriverStatus.Ok', () => {
                    controller.driverData = driverDataOk;
                    expect( controller.licenseOk ).to.be.true;
                } );

                it( 'should return false if has driverData and status === DriverStatus.Blocked', () => {
                    controller.driverData = driverDataBlocked;
                    expect( controller.licenseOk ).to.be.false;
                } );

                it( 'should return false if has no driverData', () => {
                    controller.driverData = undefined;
                    expect( controller.licenseOk ).to.be.false;
                } );
            } );

            describe( 'licenseBlocked', () => {
                it( 'should return true if has driverData and status == DriverStatus.Blocked', () => {
                    controller.driverData = driverDataBlocked;
                    expect( controller.licenseBlocked ).to.be.true;
                } );

                it( 'should return false if has driverData and status == DriverStatus.Ok', () => {
                    controller.driverData = driverDataOk;
                    expect( controller.licenseBlocked ).to.be.false;
                } );

                it( 'should return false if has no driverData', () => {
                    controller.driverData = undefined;
                    expect( controller.licenseBlocked ).to.be.false;
                } );
            } );

            describe( 'licenseExpired', () => {
                it( 'should return true if has driverData and it\'s expired ( more than 30 days after expiration date)', () => {
                    controller.driverData = driverDataExpired;
                    expect( controller.licenseExpired ).to.be.true;
                } );

                it( 'should return false if has driverData and it\'s not expired', () => {
                    controller.driverData = driverDataOk;
                    expect( controller.licenseExpired ).to.be.false;
                } );

                it( 'should return false if has no driverData', () => {
                    controller.driverData = undefined;
                    expect( controller.licenseExpired ).to.be.false;
                } );
            } );

            describe( 'licenseRenew', () => {
                it( 'should return true if has driverData and it\'s past expiration date no more than 30 days', () => {
                    controller.driverData = driverDataExpiring;
                    expect( controller.licenseRenew ).to.be.true;
                } );

                it( 'should return false if has driverData and it\'s not past expiration date', () => {
                    controller.driverData = driverDataOk;
                    expect( controller.licenseRenew ).to.be.false;
                } );

                it( 'should return false if has driverData and it\'s past expiration date more than 30 days', () => {
                    controller.driverData = driverDataExpired;
                    expect( controller.licenseRenew ).to.be.false;
                } );

                it( 'should return false if has no driverData', () => {
                    controller.driverData = undefined;
                    expect( controller.licenseRenew ).to.be.false;
                } );
            } );

            describe( 'expirationDate', () => {
                it( 'should return expiration date if has driver data', () => {
                    controller.driverData = driverDataOk;
                    expect( controller.expirationDate ).to.be.equal( driverDataOk.expirationDate );
                } );

                it( 'should return undefined if has no driverData', () => {
                    controller.driverData = undefined;
                    expect( controller.expirationDate ).to.be.undefined;
                } );
            } );

            describe( 'hasTickets', () => {
                it( 'should return true if has tickets', () => {
                    controller.tickets = tickets;
                    expect( controller.hasTickets ).to.be.true;
                } );

                it( 'should return false if has no tickets', () => {
                    controller.tickets = undefined;
                    expect( controller.hasTickets ).to.be.false;
                } );
            } );
        } );
    } );

    describe( 'Component', () => {
        // test the component/directive itself
        let component = DriverLicenseStatusComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( DriverLicenseStatusController );
        } );

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( DriverLicenseStatusTemplate );
        } );

        it( 'should use controllerAs', () => {
            expect( component ).to.have.property( 'controllerAs' );
        } );

        it( 'should use controllerAs "vm"', () => {
            expect( component.controllerAs ).to.equal( 'vm' );
        } );

        it( 'should use bindToController: true', () => {
            expect( component ).to.have.property( 'bindToController' );
            expect( component.bindToController ).to.equal( true );
        } );
    } );
} );

