#[derive(Debug)]
struct Args {
    datafile: String,
    write_to: String,
    box_size: usize,
}

const HELP: &str = "
Generate SVG file based on a graph of dependencies.

USAGE:
    run [OPTIONS]

OPTIONS:

    --datafile <filepath> path to JSON file
    --write-to <filepath> path to the output SVG file
    --box-size <N> size of a single box representing a package (default: 100px)
";

fn parse_args() -> Result<Args, lexopt::Error> {
    use lexopt::prelude::*;

    let mut datafile: Option<String> = None;
    let mut write_to: Option<String> = None;
    let mut box_size = 100;

    let mut parser = lexopt::Parser::from_env();
    while let Some(arg) = parser.next()? {
        match arg {
            Long("datafile") => {
                datafile = Some(
                    parser
                        .value()?
                        .to_str()
                        .ok_or("non UTF-8 path")?
                        .to_string(),
                )
            }
            Long("write-to") => {
                write_to = Some(
                    parser
                        .value()?
                        .to_str()
                        .ok_or("non UTF-8 path")?
                        .to_string(),
                )
            }
            Long("help") => {
                println!("{}", HELP);
                std::process::exit(0);
            }
            Long("box-size") => box_size = parser.value()?.parse()?,
            _ => return Err(arg.unexpected()),
        }
    }

    let datafile = datafile.ok_or("missing argument --datafile")?;
    let write_to = write_to.ok_or("missing argument --write-to")?;

    Ok(Args {
        datafile,
        write_to,
        box_size,
    })
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = match parse_args() {
        Ok(args) => args,
        Err(err) => {
            println!("{}", HELP);
            Err(err)?
        }
    };

    println!("Running with args {:?}", args);

    let file = std::fs::File::open(&args.datafile)?;
    let reader = std::io::BufReader::new(file);

    let input: dependency_tree_svg::Input = serde_json::from_reader(reader)?;

    let svg = dependency_tree_svg::compile_svg(input, args.box_size);

    std::fs::write(&args.write_to, svg)?;

    Ok(())
}
