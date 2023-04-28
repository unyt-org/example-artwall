FROM denoland/deno:alpine

WORKDIR /usr/app
COPY . .
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
CMD ["deno", "run", "--no-check", "--allow-all", "--unstable", "-q", "https://dev.cdn.unyt.org/uix/run.ts", "--reload"]