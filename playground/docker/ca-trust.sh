#!/bin/bash

function help {
  echo "usage: $0 <action> [cert-base-name]"
  echo "  action: add | rm | show | flush"
}

CA_CERTIFICATES_DIR="/usr/local/share/ca-certificates"
CERT_BASE_NAME=${2:-"caddy-local-docker-ca"}

case "$1" in
  add)
    ACTION="add"
    ;;
  rm | remove)
    ACTION="remove"
    ;;
  show)
    ACTION="show"
    ;;
  flush)
    ACTION="flush"
    ;;
  *)
    help
    exit 1
esac

set -eu



TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' ABRT EXIT HUP INT QUIT

ROOT_CERT_TMP="$TMP_DIR/docker-caddy-root.crt"

if [ $ACTION = "add" -o $ACTION = "remove" ]
then
  docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt "$ROOT_CERT_TMP"
  SERIAL_ID=$(openssl x509 -serial -noout -in "$ROOT_CERT_TMP" | cut -c 8-)
  CERT_NAME="$CERT_BASE_NAME-$SERIAL_ID"
else
  CERT_NAME=""
fi

# handle action into ca-certificates
case "$ACTION" in
  add)
    if [ ! -f "$CA_CERTIFICATES_DIR/$CERT_NAME.crt" ]
    then
      echo "add $CERT_NAME to $CA_CERTIFICATES_DIR and update certificates"
      sudo cp $ROOT_CERT_TMP $CA_CERTIFICATES_DIR/$CERT_NAME.crt
      sudo update-ca-certificates
    fi
    ;;
  remove)
    if [ -f "$CA_CERTIFICATES_DIR/$CERT_NAME.crt" ]
    then
      echo "remove $CERT_NAME to $CA_CERTIFICATES_DIR and update certificates"
      sudo rm "$CA_CERTIFICATES_DIR/$CERT_NAME.crt"
      sudo update-ca-certificates
    fi
    ;;
  show)
    echo "$CA_CERTIFICATES_DIR:"
    ls -1 "$CA_CERTIFICATES_DIR"
    ;;
  flush)
    CERTS=$(ls -1 "$CA_CERTIFICATES_DIR" | grep ^$CERT_BASE_NAME)

    if [ -n "$CERTS" ]
    then
      echo "$CA_CERTIFICATES_DIR:"
      for CERT in $CERTS
      do
        echo "[DELETE] $CERT"
        sudo rm "$CA_CERTIFICATES_DIR/$CERT"
      done
      sudo update-ca-certificates
    fi
    ;;
esac



function handle_action_from_nss {
  ACTION=$1
  BROWSER_CERT_DIR=$(dirname "$2")
  DB_TYPE=$3

  case "$ACTION" in
    add)
      echo -e "\n$2:"
      echo "[ADD] $CERT_NAME"
      certutil -A -n "$CERT_NAME" -t "C,," -i "$ROOT_CERT_TMP" -d "$DB_TYPE:$BROWSER_CERT_DIR"
      ;;
    remove)
      certutil -L -n "$CERT_NAME" -d "$DB_TYPE:$BROWSER_CERT_DIR" > /dev/null 2>&1
      if [ $? -eq 0 ]
      then
        echo -e "\n$2:"
        echo "[DELETE] $CERT_NAME"
        certutil -D -n "$CERT_NAME" -d "$DB_TYPE:$BROWSER_CERT_DIR"
      fi
      ;;
    show)
      echo -e "\n$BROWSER_CERT_DIR:"
      certutil -L -d "$DB_TYPE:$BROWSER_CERT_DIR"
      ;;
    flush)
      CERT_NAMES=$(certutil -L -d "$DB_TYPE:$BROWSER_CERT_DIR" | grep ^$CERT_BASE_NAME | awk '{print $1}')

      if [ -n "$CERT_NAMES" ]
      then
        echo -e "\n$BROWSER_CERT_DIR:"
        for CERT_NAME in "$CERT_NAMES"
        do
          echo "[DELETE] $CERT_NAME"
          certutil -D -d "$DB_TYPE:$BROWSER_CERT_DIR" -n "$CERT_NAME"
        done
      fi
      ;;
  esac
}

for certDB in $(find ~/.mozilla/firefox ~/.pki/nssdb -name "cert8.db")
do
  handle_action_from_nss "$ACTION" "$CERT_DB" "dbm" "$CERT_NAME"
done

for CERT_DB in $(find ~/.mozilla/firefox ~/.pki/nssdb -name "cert9.db")
do
  handle_action_from_nss "$ACTION" "$CERT_DB" "sql" "$CERT_NAME"
done

