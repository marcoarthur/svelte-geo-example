use Mojo::Base -strict;
use Test::More;
use Test::Mojo;
use Mojo::File 'curfile';
use Mojo::JSON qw(decode_json from_json);

my $script = curfile->dirname->sibling('geo_picker');
my $t = Test::Mojo->new($script);

# get all necessary things in frontend
$t->get_ok('/')->status_is(200);
$t->get_ok('/build/bundle.css');
$t->get_ok('/build/bundle.js');

# post to a bound box get results
my $file = Mojo::File->new('./t/data/geo_bbox.json');
my $data = decode_json( $file->slurp );

for my $d (@$data) {
    $t->post_ok('/geo/bbox' =>  { Accept => '*/*' } => json => $d)
    ->status_is(200)
    ->json_has('/version')
    ->json_has('/elements');
}
done_testing;
