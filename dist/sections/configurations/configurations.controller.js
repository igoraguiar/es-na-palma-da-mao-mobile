'use strict';

System.register([], function (_export, _context) {
    var _createClass, ConfigurationsController;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            ConfigurationsController = function () {
                function ConfigurationsController(logger) {
                    _classCallCheck(this, ConfigurationsController);

                    this.logger = logger;

                    this.activate();
                }

                _createClass(ConfigurationsController, [{
                    key: 'activate',
                    value: function activate() {
                        this.logger.info('Configuração Controller ativado');
                    }
                }]);

                return ConfigurationsController;
            }();

            _export('default', ['logger', ConfigurationsController]);
        }
    };
});