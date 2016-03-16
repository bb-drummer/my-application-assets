Package.describe({
  name: 'my-application:myapplication-assets',
  summary: '[MyApplication] application base assets collection',
  version: '',
  git: 'https://gitlab.bjoernbartels.earth/zf2/application-assets.git',
  documentation: 'README.md'
});

Npm.depends({
  'motion-ui': '1.1.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.imply('fourseven:scss@3.4.1');
  api.use(['ecmascript', 'jquery', 'fourseven:scss@3.4.1'], 'client');
  api.addFiles('.npm/package/node_modules/motion-ui/dist/motion-ui.css', 'client');
  api.addFiles('.npm/package/node_modules/motion-ui/dist/motion-ui.js', 'client');
  api.addFiles('dist/myapplication.js', 'client');
  api.addFiles([

    'src/scss/myapplication.scss',
    'src/scss/_global.scss',
    'src/scss/settings/_settings.scss',
    'src/scss/settings/_myapplication.scss',

    'src/scss/overrides/_bootstrap.scss',
    'src/scss/overrides/_flagicons.scss',
    'src/scss/overrides/_fontawesome.scss',
    'src/scss/overrides/_foundation.scss',
    
    'src/scss/components/_breadcrumbs.scss',
    'src/scss/components/_data-filter-form.scss',
    'src/scss/components/_flashmessages.scss',
    'src/scss/components/_footer.scss',
    'src/scss/components/_header.scss',
    'src/scss/components/_http-status-colors.scss',
    'src/scss/components/_navigation.scss',
    'src/scss/components/_panel.scss',
    'src/scss/components/_toolbar.scss',

    'src/scss/modules/_admin-aclmatrix.scss',
    'src/scss/modules/_admin-userprofile.scss',
    /*'scss/components/_drilldown.scss',
    'scss/components/_dropdown-menu.scss',
    'scss/components/_dropdown.scss',
    'scss/components/_flex-video.scss',
    'scss/components/_float.scss',
    'scss/components/_label.scss',
    'scss/components/_media-object.scss',
    'scss/components/_menu.scss',
    'scss/components/_off-canvas.scss',
    'scss/components/_orbit.scss',
    'scss/components/_pagination.scss',
    'scss/components/_progress-bar.scss',
    'scss/components/_reveal.scss',
    'scss/components/_slider.scss',
    'scss/components/_sticky.scss',
    'scss/components/_switch.scss',
    'scss/components/_table.scss',
    'scss/components/_tabs.scss',
    'scss/components/_thumbnail.scss',
    'scss/components/_title-bar.scss',
    'scss/components/_tooltip.scss',
    'scss/components/_top-bar.scss',
    'scss/components/_visibility.scss',

    'scss/forms/_checkbox.scss',
    'scss/forms/_error.scss',
    'scss/forms/_fieldset.scss',
    'scss/forms/_forms.scss',
    'scss/forms/_help-text.scss',
    'scss/forms/_input-group.scss',
    'scss/forms/_label.scss',
    'scss/forms/_select.scss',
    'scss/forms/_text.scss',

    'scss/grid/_classes.scss',
    'scss/grid/_column.scss',
    'scss/grid/_flex-grid.scss',
    'scss/grid/_grid.scss',
    'scss/grid/_gutter.scss',
    'scss/grid/_layout.scss',
    'scss/grid/_position.scss',
    'scss/grid/_row.scss',
    'scss/grid/_size.scss', */

    'src/scss/typography/_alignment.scss',
    'src/scss/typography/_base.scss',
    'src/scss/typography/_helpers.scss',
    'src/scss/typography/_print.scss',
    'src/scss/typography/_typography.scss',

    'src/scss/util/_breakpoint.scss',
    'src/scss/util/_color.scss',
    'src/scss/util/_mixins.scss',
    'src/scss/util/_selector.scss',
    'src/scss/util/_unit.scss',
    'src/scss/util/_util.scss',
    'src/scss/util/_value.scss'
    
  ], 'client', {isImport: true});
});
