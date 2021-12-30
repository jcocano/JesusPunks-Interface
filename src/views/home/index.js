import {
    Stack,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    Badge,
    useToast,
  } from "@chakra-ui/react";
  import { Link } from "react-router-dom";
  import { useWeb3React } from "@web3-react/core";
  import useJesusPunks from "../../hooks/useJesusPunks";
  import { useJesusPunksData } from '../../hooks/useJesusPunksData';
  import { useCallback, useEffect, useState } from "react"; 
  import useTruncatedAddress from "../../hooks/useTruncatedAddress";
  
  const Home = () => {
    const [isMinting, setIsMinting] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const { active, account } = useWeb3React();
    const jesusPunks = useJesusPunks();
    const { punks } = useJesusPunksData();
    const toast = useToast();

    const truncatedAddress = useTruncatedAddress(account);

    const getJesusPunksData = useCallback(async () => {
      if (jesusPunks) {
        const totalSupply = await jesusPunks.methods.totalSupply().call();
        const dnaPreview = await jesusPunks.methods
          .deterministicPseudoRandomDNA(totalSupply, account)
          .call();
        const image = await jesusPunks.methods.imageByDNA(dnaPreview).call();
        setImageSrc(image);
      }
    }, [jesusPunks, account]);
  
    useEffect(() => {
      getJesusPunksData();
    }, [getJesusPunksData]);

    const mint = () => {
        setIsMinting(true);

        jesusPunks.methods
        .mint()
        .send({
            from: account,
        })
        .on("transactionHash", (txHash) =>{
            toast({
                tite: 'Transacción enviada',
                description: txHash,
                status: 'info',
            });
        })
        .on("receipt", () => {
          setIsMinting(false);
          toast({
            title: "Transacción confirmada",
            description: "Nunca pares de aprender.",
            status: "success",
            });
        })
        .on("error", (error) => {
            setIsMinting(false);
            toast({
                title: 'Transacción Fallida',
                description: error.message,
                status: 'error'
            });
        });
    };

  
    return (
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 4, md: 4 }}
        direction={{ base: "column-reverse", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
          >
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "green.400",
                zIndex: -1,
              }}
            >
              Un Jesus Punk
            </Text>
            <br />
            <Text as={"span"} color={"green.400"}>
              esta programando en Blockchain
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Jesus Punks es una colección de Avatares randomizados cuya metadata
            es almacenada on-chain. Poseen características únicas y sólo hay 256
            en existencia.
          </Text>
          <Text color={"green.500"}>
            Cada Jesus Punk se genera de forma secuencial basado en la direccion de tu wallet
            y el numero minteado, usa el previsualizador para averiguar cuál sería tu Jesus Punk si
            minteas en este momento, usa el boton de actualizar por si cambio.
          </Text>
          <Stack
            spacing={{ base: 2, sm: 4 }}
            direction={{ base: "column", sm: "row" }}
          >
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"green"}
              bg={"green.400"}
              _hover={{ bg: "green.500" }}
              disabled={!jesusPunks}
              onClick={mint}
              isLoading={isMinting}
            >
              Obtén tu punk
            </Button>
            <Link to="/punks">
              <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
                Galería
              </Button>
            </Link>
          </Stack>
        </Stack>
        <Flex
          flex={1}
          direction="column"
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          <Image src={active ? imageSrc : "https://avataaars.io/"} />
          {active ? (
            <>
              <Flex mt={2}>
                <Badge>
                  Next ID:
                  <Badge ml={1} colorScheme="green">
                    {punks.length}
                  </Badge>
                </Badge>
                <Badge ml={2}>
                  Address:
                  <Badge ml={1} colorScheme="green">
                    {truncatedAddress}
                  </Badge>
                </Badge>
              </Flex>
              <Button
                onClick={getJesusPunksData}
                mt={4}
                size="xs"
                colorScheme="green"
              >
                Actualizar
              </Button>
            </>
          ) : (
            <Badge mt={2}>Wallet desconectado</Badge>
          )}
        </Flex>
      </Stack>
    );
  };
  
  export default Home;