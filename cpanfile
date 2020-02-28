requires 'DDP';
requires 'Digest::MD5';
requires 'Mojo::JSON';
requires 'Mojo::Redis';
requires 'Mojolicious::Lite';

on test => sub {
    requires 'Mojo::Base';
    requires 'Mojo::File';
    requires 'Test::Mojo';
    requires 'Test::More';
};

on 'develop' => sub {
    recommends 'Mojolicious::Plugin::Webpack';
};
