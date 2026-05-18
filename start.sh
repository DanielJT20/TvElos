#!/bin/bash
# Script de inicialização do TV ELOS
# Inicia backend (API na porta 3001) e frontend (estático na porta 5000)
node backend/server.js &
node server.js
