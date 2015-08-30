define(['common/throttler', 'where/builds/nodesData', 'where/builds/nodesRenderer', 'where/builds/nodeUpdater', 'app-config', 'jquery', 'bootstrap'],
  function (throttlerFactory, data, renderer, updater, config, $, bs) {
    'use strict';
    var viewNeedsUpdate = true,
      my = {};

    var throttler = throttlerFactory.newThrottler(function (node) {
      updater.update(node, throttler.scheduleUpdate);
    }, config.bulkUpdateSize, config.updateInterval);


    var changeEvent = "change";

    my.init = function () {
      if (data.revision) {
        throttler.scheduleUpdate(data.data);

        $(data.data).bind(changeEvent, function () {
          viewNeedsUpdate = true;
          setTimeout(function () {
            if (viewNeedsUpdate) {
              renderer.renderData();
              viewNeedsUpdate = false;
            }
          }, 0);
        });
        $(data.data).trigger(changeEvent);
      }

      $(document).ready(function () {
        var revs = $("#revs");
        revs.on('show.bs.dropdown', function () {
          $("#graph").attr("class", "col-md-offset-3 col-md-9");
          $(data.data).trigger(changeEvent);
        });
        revs.on('hide.bs.dropdown', function () {
          $("#graph").attr("class", "col-md-12");
          $(data.data).trigger(changeEvent);
        });
      });
    };
    return my;
  }
);