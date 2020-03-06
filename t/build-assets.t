use strict;
use warnings;
use Test::More;
use Test::Mojo;
use Mojo::File 'curfile';
 
# Run with TEST_BUILD_ASSETS=1 prove -vl t/build-assets.t
plan skip_all => "TEST_BUILD_ASSETS=1" unless $ENV{TEST_BUILD_ASSETS};
 
# Load the app and make a test object
$ENV{MOJO_MODE}          = 'production';
#$ENV{MOJO_WEBPACK_BUILD} = 1;
my $script = curfile->dirname->sibling('geo_picker');
my $t = Test::Mojo->new($script);
 
# Find all the tags and make sure they can be loaded
$t->get_ok("/")->status_is(200);
$t->element_count_is('script[src], link[href][rel=stylesheet]', 3);
$t->tx->res->dom->find("script[src], link[href][rel=stylesheet]")->each(sub {
  $t->get_ok($_->{href} || $_->{src})->status_is(200);
});
 
done_testing;
