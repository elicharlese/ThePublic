fn main() {
let _guard = sentry::init(("https://b67e964eee0a4b55b0dcc593c7293b1c@o1005824.ingest.us.sentry.io/5966314", sentry::ClientOptions {
release: sentry::release_name!(),
..Default::default()
}));

tokio::runtime::Builder::new_multi_thread()
.enable_all()
.build()
.unwrap()
.block_on(async {
// implementation of main
});
}