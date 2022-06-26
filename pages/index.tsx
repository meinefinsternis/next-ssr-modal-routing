import { PokemonApi } from "api/pokemon.api";
import { Modal } from "components/Modal";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { CurrentPokemon, ListOfPokemon } from "types/pokemon.types";
import styles from "../styles/Home.module.css";
import { ParsedUrlQuery } from "querystring";

type HomeProps = {
  listOfPokemon: ListOfPokemon;
  currentPokemon?: CurrentPokemon;
};

const Home: NextPage<HomeProps> = ({ listOfPokemon, currentPokemon }) => {
  const router = useRouter();

  const handleModalClose = () => router.push("/", undefined, { shallow: true });

  const currentPokemonName = router.query.name;

  return (
    <div className={styles.container}>
      {currentPokemonName && currentPokemon && (
        <Modal onClose={handleModalClose}>
          <div style={{ textAlign: "center" }}>{currentPokemon.name}</div>
          <Image
            src={currentPokemon.sprites.front_shiny}
            width={150}
            height={150}
            alt={currentPokemon.name}
          />
        </Modal>
      )}
      {listOfPokemon.results.map(({ name }) => (
        <Link href={`/p/${name}`} shallow key={name}>
          <a>
            <div>{name}</div>
          </a>
        </Link>
      ))}
    </div>
  );
};

interface Params extends ParsedUrlQuery {
  name: string;
}

export const getServerSideProps: GetServerSideProps<any, Params> = async (
  ctx
) => {
  const listOfPokemon = await PokemonApi.getAll();

  if (ctx.params) {
    try {
      const currentPokemon = await PokemonApi.getOne(ctx.params.name);
      return {
        props: {
          currentPokemon,
          listOfPokemon,
        },
      };
    } catch (err) {
      return {
        // fallback
        notFound: true,
      };
    }
  }

  return {
    props: { listOfPokemon },
  };
};

export default Home;
