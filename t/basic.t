use Mojo::Base -strict;
use Test::More;
use Test::Mojo;
use Mojo::File 'curfile';
use Mojo::JSON qw(decode_json from_json encode_json);

my $script = curfile->dirname->sibling('geo_picker');
my $t = Test::Mojo->new($script);

# get all necessary things in frontend
$t->get_ok('/')->status_is(200);

# post to a bound box get results
my $file = Mojo::File->new('./t/data/geo_bbox.json');
my $data = decode_json( $file->slurp );

for my $d (@$data) {
    my $res = $t->tx->res->json;
    $t->post_ok('/geo/bbox' =>  { Accept => 'json/application' } => json => $d)
    ->status_is(200)
    ->json_has('/version')
    ->json_has('/elements')
    ->json_has('/generator')
    ->json_has('/osm3s')
    ->or( sub { diag explain $res } );
}

# generate a random point and make a polygon from it
sub signal { rand > 1 / 2 ? 1 : -1; }

sub rpoint {
  my $signal = signal();
  my $calc   = sub { rand(90) * $signal };
  my $rpoint = [$calc->(), $calc->()];
  return $rpoint;
}

my $point = rpoint();

sub rpolygon {
  my $point = rpoint();
  my $inc   = sub { return rand() * signal() };

  # four points with random increments
  return [
    $point,
    [$point->[0] + $inc->(), $point->[1]],
    [$point->[0],            $point->[1] + $inc->()],
    [$point->[0] + $inc->(), $point->[1] + $inc->()],
  ];
}

my $json = {
  geometry => {coordinates => [ rpolygon() ], type => "Polygon"},
  type     => "Feature",
};

# make call to service
my $res = $t->tx->res->json;
$t->post_ok('/geo/bbox' => {Accept => 'json/application'} => json => $json)
 ->status_is(200)
 ->json_has('/version')
 ->json_has('/elements')
 ->json_has('/generator')
 ->json_has('/osm3s')
 ->or( sub { diag explain $res } );

done_testing;
