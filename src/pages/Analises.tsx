                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="relator">Relator</Label>
                <Input
                  id="relator"
                  placeholder="Nome do relator"
                  value={filtros.relator || ''}
                  onChange={(e) => handleFilterChange('relator', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tipo_documento">Tipo de Documento</Label>
                <Select
                  value={filtros.tipo_documento || ''}
                  onValueChange={(value) => handleFilterChange('tipo_documento', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="Acórdão">Acórdão</SelectItem>
                    <SelectItem value="Decisão Monocrática">Decisão Monocrática</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="data_inicio">Data Início</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={filtros.intervalo_datas?.inicio || ''}
                  onChange={(e) => handleFilterChange('intervalo_datas', {
                    ...filtros.intervalo_datas,
                    inicio: e.target.value
